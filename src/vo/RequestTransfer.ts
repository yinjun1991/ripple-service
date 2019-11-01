export interface RequestTransfer {
  sender: string;
  receiver: string;
  /*in drop unit*/
  amount: string;
  /*in xrp unit*/
  fee: string;
  tag: number;
  secret: string;
}
