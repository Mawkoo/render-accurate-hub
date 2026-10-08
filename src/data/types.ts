export type WarrantyStatus = "Active" | "Claimed" | "Transferred" | "Expired";

export interface Receipt {
  id: string;
  storeName: string;
  purchaseDate: string; // YYYY-MM-DD
  itemName: string;
  category: string;
  serialNumber: string;
  price: number;
  warrantyMonths: number;
}

export interface OwnershipHistory {
  wallet: string;
  ownerName: string;
  date: string;
  txHash?: string;
}

export interface WarrantyPassport {
  id: string;
  code: string; // public verify code
  receipt: Receipt;
  status: WarrantyStatus;
  expiryDate: string;
  ownerWallet: string;
  receiptHash?: string;
  assetIdHash?: string;
  txHash?: string;
  issuedAt?: string;
  history: OwnershipHistory[];
}

export interface ActivityLog {
  id: string;
  type: "scan" | "issue" | "transfer" | "verify" | "claim";
  actor: string;
  description: string;
  date: string;
}
