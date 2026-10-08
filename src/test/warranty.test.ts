import { describe, expect, it } from "vitest";
import { computeExpiry, daysLeft, reminderLevel, effectiveStatus } from "@/lib/warranty";
import type { WarrantyPassport } from "@/data/types";

const today = new Date("2026-10-08T00:00:00Z");

describe("warranty rules", () => {
  it("adds warranty months to purchase date", () => {
    expect(computeExpiry("2025-09-14", 24)).toBe("2027-09-14");
  });
  it("H-7 reminder at 7 days left", () => {
    expect(reminderLevel({ status: "Active", expiryDate: "2026-10-15" }, today)).toBe("H-7");
  });
  it("H-30 reminder at 30 days left", () => {
    expect(reminderLevel({ status: "Active", expiryDate: "2026-11-07" }, today)).toBe("H-30");
  });
  it("no reminder at 31 days or for non-active", () => {
    expect(reminderLevel({ status: "Active", expiryDate: "2026-11-08" }, today)).toBeNull();
    expect(reminderLevel({ status: "Transferred", expiryDate: "2026-10-10" }, today)).toBeNull();
  });
  it("active past expiry shows Expired", () => {
    expect(daysLeft("2026-10-01", today)).toBe(-7);
    expect(effectiveStatus({ status: "Active", expiryDate: "2026-10-01" } as WarrantyPassport, today)).toBe("Expired");
  });
});
