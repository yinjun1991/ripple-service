import { getLogger } from 'log4js';
import { Controller, Post, Body, Res, Get, Query, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { ResWapper, ErrCode, RequestTransfer } from './vo';
import { Options, HistoryOptions } from './dto'

@Controller()
export class AppController {
  private logger = getLogger('AppController');

  constructor(private readonly appService: AppService) {
  }

  @Get('status')
  clientInited(@Res() res: Response) {
    try {
      const status = this.appService.clientStatus();
      res.json(ResWapper.success(status));
    } catch (e) {
      res.json(ResWapper.fail(ErrCode.ERR_INIT_FAILED, e.message));
    }
  }

  @Post('init')
  async initClient(@Body() options: Options, @Res() res: Response) {
    try {
      await this.appService.init(options);
      res.json(ResWapper.success({
        success: true,
      }));
    } catch (e) {
      res.json(ResWapper.fail(ErrCode.ERR_INIT_FAILED, e.message));
    }
  }

  @Post('transfer')
  async transfer(@Body() data: RequestTransfer, @Res() res: Response) {
    try {
      const txId = await this.appService.transfer(data.sender, data.receiver, data.amount, data.fee, data.tag, data.secret);
      res.json(ResWapper.success(txId));
    } catch (e) {
      res.json(ResWapper.fail(ErrCode.ERR_TRANSFER_FAILED, e.message));
      this.logger.error(`failed to transfer ${data.sender} ${data.receiver} ${data.amount}: ${e.message}`);
    }
  }

  @Get('transaction/:hash')
  async getTransaction(@Param('hash') hash: string, @Res() res: Response) {
    try {
      const tx = await this.appService.getTransaction(hash);
      res.json(ResWapper.success(tx));
    } catch (e) {
      res.json(ResWapper.fail(ErrCode.ERR_GET_TX_FAILED, e.message));
      this.logger.error(`failed to get transaction ${hash}: ${e.message}`);
    }
  }

  @Get('account/:account')
  async getAccountInfo(@Param('account') account: string, @Res() res: Response) {
    try {
      const accountInfo = await this.appService.getAccountInfo(account)
      res.json(ResWapper.success(accountInfo))
    } catch(e) {
      res.json(ResWapper.fail(2, e.message))
      this.logger.error(`failed to get account ${account}: ${e.message}`)
    }
  }

  @Get('history/:account/:start/:end')
  async getHistory(@Param('account') account: string, @Param('start') start: number, @Param('end') end: number, @Res() res: Response) {
    try {
      start *= 1
      end *= 1
      const opt: HistoryOptions = {
        limit: 1000000,
        minLedgerVersion: start, 
        maxLedgerVersion: end,
      }

      opt.binary = false
      opt.earliestFirst = true
      // opt.initiated = true
      opt.types = ['payment'];
      
      const txs = await this.appService.getTransactions(account, opt);
      res.json(ResWapper.success(txs));
    } catch(e) {
      res.json(ResWapper.fail(2, e.message));
      this.logger.error(`failed to get transactions for ${account}: ${e.message}`)
    }
  }

  @Get('height')
  async getBlockHeight(@Res() res: Response) {
    try {
      const height = await this.appService.getBlockHeight()
      res.json(ResWapper.success(height));
    } catch(e) {
      res.json(ResWapper.fail(2, e.message));
      this.logger.error(`failed to get block height: ${e.message}`)
    }
  }
}
