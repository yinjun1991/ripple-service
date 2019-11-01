export class PendingTx {
  constructor(
    public readonly txId: string,
    public readonly minLedgerVersion: number,
    public readonly maxLedgerVersion: number,
  ) {
  }
}
