import { Injectable } from '@nestjs/common';
import { FormattedTransactionType, RippleAPI } from 'ripple-lib';
import { getLogger } from 'log4js';
import { Status, Options, HistoryOptions } from './dto';

@Injectable()
export class AppService {
  private logger = getLogger('AppService');

  private client: RippleAPI;
  private clientOk: boolean;
  private options: Options;

  async init(options: Options) {
    this.options = options;
    const client = new RippleAPI(options);
    client.on('error', (code, message) => {
      this.logger.error(`error: code[${code}] message[${message}]`);
    });
    client.on('connected', () => {
      this.clientOk = true;
      this.logger.info(`connected: ${options.server}`);
    });
    client.on('disconnected', code => {
      this.clientOk = false;
      // code refer https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
      const message = `disconnected: code[${code}] ${options.server}`;
      if (code === 1000) {
        this.logger.warn(message);
      } else {
        this.logger.error(message);
      }
    });

    await client.connect();
    this.client = client;
  }

  clientStatus(): Status {
    return {
      options: this.options,
      ok: this.isClientOk(),
    };
  }

  private isClientOk(): boolean {
    return this.client != null && this.clientOk;
  }

  private clientMustOk() {
    if (!this.isClientOk()) {
      throw new Error('client not normal');
    }
  }

  /**
   * send payment transaction
   * @param sender
   * @param receiver
   * @param amount    should be drops unit
   * @param fee       fee xrp unit
   * @param tag       memo
   * @param secret    private key
   */
  async transfer(sender: string, receiver: string, amount: string, fee: string, tag: number, secret: string): Promise<string> {
    this.clientMustOk();

    // https://xrpl.org/rippleapi-reference.html#preparepayment
    const preparedTx = await this.client.preparePayment(sender, {
      allowPartialPayment: false,
      source: {
        address: sender,
        maxAmount: {
          value: amount,
          currency: 'drops',
        },
        // amount: {
        //   value: amount,
        //   currency: 'drops',
        // },
      },
      destination: {
        address: receiver,
        amount: {
          value: amount,
          currency: 'drops',
        },
        tag,
      },
    }, {
      maxLedgerVersionOffset: 75,
      // todo
      // drops unit
      fee,
    });

    // sign
    const response = this.client.sign(preparedTx.txJSON, secret);
    const { id: txId, signedTransaction: txBlob } = response;

    // submit
    await this.client.submit(txBlob);

    return txId;
  }

  async getTransaction(hash: string): Promise<FormattedTransactionType> {
    this.clientMustOk();

    return this.client.getTransaction(hash);
  }

  async getTransactions(account: string, options: HistoryOptions) {
    this.clientMustOk();
    return this.client.getTransactions(account, options);
  }

  async getAccountInfo(account: string) {
    this.clientMustOk();
    return this.client.getAccountInfo(account)
  }

  async getBlockHeight(): Promise<number> {
    this.clientMustOk();
    return this.client.getLedgerVersion();
  }
}
