import type { ActivityLog, WarrantyPassport } from "./types";

export const CURRENT_USER = {
  name: "Raka Pratama (fiktif)",
  wallet: "0xA11CE0000000000000000000000000000000D3M0",
};

const W = CURRENT_USER.wallet;

export const dummyPassports: WarrantyPassport[] = [
  {
    id: "p1",
    code: "NC-7F3A-21K9",
    status: "Active",
    expiryDate: "2027-09-14",
    ownerWallet: W,
    receiptHash: "0x5e1c8a0b2f7d4e9a3c6b1f0e8d7a2c4b9e3f1a6d8c0b7e2f4a9d1c3e5b7f0a2c",
    assetIdHash: "0x9a2b4c6d8e0f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b",
    txHash: "0x3f9d2c1b0a8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c",
    issuedAt: "2025-09-15",
    receipt: { id: "r1", storeName: "Toko Elektronik Sinar Jaya", purchaseDate: "2025-09-14", itemName: "Laptop Orbis Pro 14", category: "Laptop", serialNumber: "ORB14-88213", price: 14500000, warrantyMonths: 24 },
    history: [{ wallet: W, ownerName: "Raka Pratama (fiktif)", date: "2025-09-15" }],
  },
  {
    id: "p2",
    code: "NC-2B8D-55Q1",
    status: "Active",
    expiryDate: addDaysISO(20),
    ownerWallet: W,
    receipt: { id: "r2", storeName: "Gadget Corner Mall Kota", purchaseDate: addDaysISO(20 - 365), itemName: "Smartphone Nova X2", category: "Smartphone", serialNumber: "NVX2-30019", price: 6200000, warrantyMonths: 12 },
    history: [{ wallet: W, ownerName: "Raka Pratama (fiktif)", date: addDaysISO(20 - 365) }],
  },
  {
    id: "p3",
    code: "NC-9C1E-03ZT",
    status: "Active",
    expiryDate: addDaysISO(5),
    ownerWallet: W,
    receiptHash: "0x1b3d5f7a9c0e2f4a6b8d0c2e4f6a8b0d2c4e6f8a0b2d4c6e8f0a2b4d6c8e0f2a",
    assetIdHash: "0x7c9e1a3b5d7f9a1c3e5b7d9f1a3c5e7b9d1f3a5c7e9b1d3f5a7c9e1b3d5f7a9c",
    txHash: "0x8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d",
    issuedAt: addDaysISO(5 - 180),
    receipt: { id: "r3", storeName: "Audio Hub Nusantara", purchaseDate: addDaysISO(5 - 180), itemName: "Headphone Aurora ANC", category: "Audio", serialNumber: "AUR-ANC-7712", price: 2350000, warrantyMonths: 6 },
    history: [{ wallet: W, ownerName: "Raka Pratama (fiktif)", date: addDaysISO(5 - 180) }],
  },
  {
    id: "p4",
    code: "NC-4D6F-88MM",
    status: "Claimed",
    expiryDate: "2026-12-01",
    ownerWallet: W,
    receipt: { id: "r4", storeName: "Rumah Elektronik Makmur", purchaseDate: "2025-12-01", itemName: "Mesin Cuci Bersih 8kg", category: "Peralatan Rumah", serialNumber: "BRS8-11290", price: 4100000, warrantyMonths: 12 },
    history: [{ wallet: W, ownerName: "Raka Pratama (fiktif)", date: "2025-12-01" }],
  },
  {
    id: "p5",
    code: "NC-6E0A-12PL",
    status: "Transferred",
    expiryDate: "2027-03-10",
    ownerWallet: "0xB0B0000000000000000000000000000000D3M01",
    receiptHash: "0x4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c",
    assetIdHash: "0x2e4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a",
    txHash: "0x6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b",
    issuedAt: "2025-03-11",
    receipt: { id: "r5", storeName: "Kamera Dunia Digital", purchaseDate: "2025-03-10", itemName: "Kamera Lumen M50", category: "Kamera", serialNumber: "LMN50-44018", price: 9800000, warrantyMonths: 24 },
    history: [
      { wallet: W, ownerName: "Raka Pratama (fiktif)", date: "2025-03-11" },
      { wallet: "0xB0B0000000000000000000000000000000D3M01", ownerName: "Penerima (fiktif)", date: "2026-06-02", txHash: "0x77aa…e2" },
    ],
  },
  {
    id: "p6",
    code: "NC-1A2B-77XY",
    status: "Expired",
    expiryDate: "2026-01-20",
    ownerWallet: W,
    receipt: { id: "r6", storeName: "Toko Elektronik Sinar Jaya", purchaseDate: "2025-01-20", itemName: "Smartwatch Pulse S", category: "Wearable", serialNumber: "PLS-S-90021", price: 1750000, warrantyMonths: 12 },
    history: [{ wallet: W, ownerName: "Raka Pratama (fiktif)", date: "2025-01-20" }],
  },
];

export const dummyActivity: ActivityLog[] = [
  { id: "a1", type: "issue", actor: "user_0142", description: "Menerbitkan bukti on-chain NC-7F3A-21K9", date: "2026-10-08 09:12" },
  { id: "a2", type: "verify", actor: "publik", description: "Verifikasi kode NC-6E0A-12PL — Valid", date: "2026-10-08 08:40" },
  { id: "a3", type: "scan", actor: "user_0310", description: "Scan nota baru (Smartphone)", date: "2026-10-07 21:05" },
  { id: "a4", type: "transfer", actor: "user_0142", description: "Transfer NC-6E0A-12PL ke 0xB0B0…M01", date: "2026-10-07 17:22" },
  { id: "a5", type: "verify", actor: "publik", description: "Verifikasi kode NC-XXXX-0000 — Tidak Valid", date: "2026-10-07 11:03" },
  { id: "a6", type: "claim", actor: "service_center_07", description: "Klaim garansi NC-4D6F-88MM", date: "2026-10-06 14:50" },
];

export const adminStats = {
  totalReceipts: 12480,
  passportsIssued: 8932,
  transfers: 1204,
  verifications: 30451,
  monthly: [
    { month: "Mei", nota: 1320, paspor: 910 },
    { month: "Jun", nota: 1490, paspor: 1060 },
    { month: "Jul", nota: 1710, paspor: 1220 },
    { month: "Agu", nota: 1980, paspor: 1430 },
    { month: "Sep", nota: 2240, paspor: 1650 },
    { month: "Okt", nota: 2510, paspor: 1880 },
  ],
  statusSplit: [
    { name: "Active", value: 6120 },
    { name: "Claimed", value: 910 },
    { name: "Transferred", value: 1204 },
    { name: "Expired", value: 698 },
  ],
};

function addDaysISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
