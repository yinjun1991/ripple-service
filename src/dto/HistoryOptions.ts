export interface HistoryOptions {
    start?: string,
    limit?: number,
    minLedgerVersion?: number,
    maxLedgerVersion?: number,
    earliestFirst?: boolean,
    excludeFailures?: boolean,
    initiated?: boolean,
    counterparty?: string,
    types?: Array<string>,
    includeRawTransactions?: boolean,
    binary?: boolean
}