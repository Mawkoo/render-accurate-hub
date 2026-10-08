import { useSyncExternalStore } from "react";
import { dummyPassports } from "@/data/dummy";
import type { WarrantyPassport } from "@/data/types";

let state: WarrantyPassport[] = dummyPassports;
const listeners = new Set<() => void>();

export const passportStore = {
  get: () => state,
  set(next: WarrantyPassport[]) {
    state = next;
    listeners.forEach((l) => l());
  },
  update(id: string, patch: Partial<WarrantyPassport>) {
    passportStore.set(state.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  },
  add(p: WarrantyPassport) {
    passportStore.set([p, ...state]);
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function usePassports() {
  return useSyncExternalStore(passportStore.subscribe, passportStore.get, () => dummyPassports);
}

export function usePassport(id: string) {
  return usePassports().find((p) => p.id === id);
}
