import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { LayoutGrid, List, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState, PageHeader, PassportCard, StatusBadge, WarrantyProgress } from "@/components/nc/ui";
import { usePassports } from "@/lib/store";
import { effectiveStatus, fmtDate } from "@/lib/warranty";
import type { WarrantyStatus } from "@/data/types";

export const Route = createFileRoute("/app/warranties/")({
  head: () => ({
    meta: [
      { title: "Daftar Garansi — NotaChain" },
      { name: "description", content: "Semua paspor garansimu dengan filter status dan pencarian." },
      { property: "og:title", content: "Daftar Garansi — NotaChain" },
      { property: "og:description", content: "Semua paspor garansi dengan filter dan pencarian." },
    ],
  }),
  component: Warranties,
});

const filters: ("Semua" | WarrantyStatus)[] = ["Semua", "Active", "Claimed", "Transferred", "Expired"];

function Warranties() {
  const passports = usePassports();
  const [q, setQ] = useState("");
  const [f, setF] = useState<(typeof filters)[number]>("Semua");
  const [view, setView] = useState<"table" | "card">("table");
  const list = passports.filter((p) => {
    const s = effectiveStatus(p);
    const t = `${p.receipt.itemName} ${p.receipt.storeName} ${p.code}`.toLowerCase();
    return (f === "Semua" || s === f) && t.includes(q.toLowerCase());
  });

  return (
    <>
      <PageHeader title="Daftar Garansi" desc={`${passports.length} paspor tercatat`} />
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Cari barang, toko, atau kode…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {filters.map((x) => (
            <button key={x} onClick={() => setF(x)} className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm ${f === x ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>{x}</button>
          ))}
        </div>
        <div className="hidden rounded-lg border bg-card p-1 md:flex">
          <button aria-label="Tabel" onClick={() => setView("table")} className={`rounded p-1.5 ${view === "table" ? "bg-muted" : ""}`}><List className="h-4 w-4" /></button>
          <button aria-label="Kartu" onClick={() => setView("card")} className={`rounded p-1.5 ${view === "card" ? "bg-muted" : ""}`}><LayoutGrid className="h-4 w-4" /></button>
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState title="Tidak ada garansi" desc="Coba ubah filter atau kata kunci pencarian." />
      ) : (
        <>
          <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${view === "table" ? "md:hidden" : ""}`}>
            {list.map((p) => <PassportCard key={p.id} passport={p} />)}
          </div>
          {view === "table" && (
            <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Barang</TableHead><TableHead>Kode</TableHead><TableHead>Status</TableHead><TableHead className="w-48">Sisa garansi</TableHead><TableHead>Berakhir</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <Link to="/app/warranties/$id" params={{ id: p.id }} className="font-medium hover:text-primary">{p.receipt.itemName}</Link>
                        <div className="text-xs text-muted-foreground">{p.receipt.storeName}</div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{p.code}</TableCell>
                      <TableCell><StatusBadge status={effectiveStatus(p)} /></TableCell>
                      <TableCell><WarrantyProgress passport={p} /></TableCell>
                      <TableCell className="text-sm">{fmtDate(p.expiryDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </>
  );
}
