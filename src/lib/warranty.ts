import type { Receipt, WarrantyPassport } from "@/data/types";

const DAY = 86_400_000;

export function daysLeft(expiryDate: string, today: Date = new Date()): number {
  const end = new Date(expiryDate + "T00:00:00");
  const start = new Date(today.toISOString().slice(0, 10) + "T00:00:00");
  return Math.round((end.getTime() - start.getTime()) / DAY);
}

export function computeExpiry(purchaseDate: string, months: number): string {
  const d = new Date(purchaseDate + "T00:00:00");
  d.setMonth(d.getMonth() + months);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Percentage of warranty period remaining (0-100). */
export function remainingPercent(p: Pick<WarrantyPassport, "expiryDate"> & { receipt: Pick<Receipt, "purchaseDate"> }, today = new Date()) {
  const total = daysLeft(p.expiryDate, new Date(p.receipt.purchaseDate + "T00:00:00Z"));
  const left = daysLeft(p.expiryDate, today);
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((left / total) * 100)));
}

/** Reminder level: H-7 or H-30 before expiry, only for Active passports. */
export function reminderLevel(p: Pick<WarrantyPassport, "status" | "expiryDate">, today = new Date()): "H-7" | "H-30" | null {
  if (p.status !== "Active") return null;
  const d = daysLeft(p.expiryDate, today);
  if (d < 0) return null;
  if (d <= 7) return "H-7";
  if (d <= 30) return "H-30";
  return null;
}

/** Active passports past expiry are shown as Expired. */
export function effectiveStatus(p: WarrantyPassport, today = new Date()) {
  if (p.status === "Active" && daysLeft(p.expiryDate, today) < 0) return "Expired" as const;
  return p.status;
}

export async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return "0x" + Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function receiptMetadata(r: Receipt) {
  return JSON.stringify({ store: r.storeName, date: r.purchaseDate, item: r.itemName, serial: r.serialNumber, months: r.warrantyMonths });
}

export function randomHex(len = 64) {
  const a = new Uint8Array(len / 2);
  crypto.getRandomValues(a);
  return "0x" + Array.from(a).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function isValidDummyWallet(w: string) {
  return /^0x[0-9a-fA-F]{40}$/.test(w) || /^0x[0-9A-Za-z]{40}$/.test(w);
}

export function shortHash(h?: string, n = 6) {
  if (!h) return "—";
  return h.length > n * 2 + 2 ? `${h.slice(0, n + 2)}…${h.slice(-n)}` : h;
}

export const rupiah = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export const fmtDate = (iso: string) => new Date(iso + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
