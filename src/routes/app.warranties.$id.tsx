import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Cloud, Database, Loader2, Repeat, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState, HashRow, Notice, QRBlock, StatusBadge, WarrantyProgress } from "@/components/nc/ui";
import { passportStore, usePassport } from "@/lib/store";
import { effectiveStatus, fmtDate, randomHex, receiptMetadata, rupiah, sha256Hex, shortHash } from "@/lib/warranty";

export const Route = createFileRoute("/app/warranties/$id")({
  head: () => ({
    meta: [
      { title: "Paspor Garansi — NotaChain" },
      { name: "description", content: "Detail paspor garansi, bukti on-chain, QR, dan riwayat pemilik." },
      { property: "og:title", content: "Paspor Garansi — NotaChain" },
      { property: "og:description", content: "Detail paspor garansi dan bukti on-chain." },
    ],
  }),
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const p = usePassport(id);
  const [busy, setBusy] = useState(false);
  if (!p) return <EmptyState title="Paspor tidak ditemukan" action={<Button asChild variant="outline"><Link to="/app/warranties">Kembali</Link></Button>} />;
  const status = effectiveStatus(p);
  const r = p.receipt;

  const issue = async () => {
    setBusy(true);
    const receiptHash = await sha256Hex(receiptMetadata(r));
    const assetIdHash = await sha256Hex(r.serialNumber);
    await new Promise((res) => setTimeout(res, 1400));
    passportStore.update(p.id, { receiptHash, assetIdHash, txHash: randomHex(), issuedAt: new Date().toISOString().slice(0, 10) });
    setBusy(false);
    toast.success("Bukti on-chain diterbitkan (simulasi)");
  };

  const timeline = [
    { label: "Barang dibeli", date: r.purchaseDate },
    { label: "Nota dipindai & paspor dibuat", date: p.history[0]?.date },
    ...(p.issuedAt ? [{ label: "Bukti on-chain diterbitkan", date: p.issuedAt }] : []),
    ...p.history.slice(1).map((h) => ({ label: `Ditransfer ke ${shortHash(h.wallet, 4)}`, date: h.date })),
    ...(status === "Claimed" ? [{ label: "Garansi diklaim", date: "" }] : []),
    { label: status === "Expired" ? "Garansi berakhir" : "Garansi akan berakhir", date: p.expiryDate },
  ];

  return (
    <>
      <Link to="/app/warranties" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Daftar garansi</Link>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="font-mono text-sm text-muted-foreground">{p.code}</div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{r.itemName}</h1>
          <div className="mt-2"><StatusBadge status={status} /></div>
        </div>
        <div className="flex flex-wrap gap-2">
          {!p.txHash && (
            <Button onClick={issue} disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : <ShieldCheck />} Terbitkan Bukti</Button>
          )}
          {status === "Active" && (
            <Button asChild variant="outline"><Link to="/app/transfer/$id" params={{ id: p.id }}><Repeat /> Transfer</Link></Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border bg-card p-5">
            <div className="mb-4 font-semibold">Informasi barang</div>
            <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              {[
                ["Toko", r.storeName], ["Tanggal beli", fmtDate(r.purchaseDate)], ["Kategori", r.category],
                ["Nomor seri", r.serialNumber], ["Harga", rupiah(r.price)], ["Masa garansi", `${r.warrantyMonths} bulan`],
              ].map(([k, v]) => (
                <div key={k}><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>
              ))}
            </dl>
            <div className="mt-5"><WarrantyProgress passport={p} /></div>
          </section>

          <section className="rounded-xl border bg-card p-5">
            <div className="mb-2 flex items-center justify-between">
              <div className="font-semibold">Bukti on-chain</div>
              {p.txHash && <span className="text-xs text-success">● Tercatat (simulasi)</span>}
            </div>
            {p.txHash ? (
              <>
                <HashRow label="Receipt hash (SHA-256)" value={p.receiptHash} />
                <HashRow label="Asset ID / serial hash" value={p.assetIdHash} />
                <HashRow label="Tx hash (dummy)" value={p.txHash} />
                <HashRow label="Expiry timestamp" value={String(Math.floor(new Date(p.expiryDate).getTime() / 1000))} />
                <HashRow label="Owner wallet" value={p.ownerWallet} />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Belum diterbitkan. Klik "Terbitkan Bukti" untuk menghitung hash SHA-256 dari metadata nota di browser-mu.</p>
            )}
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border bg-card p-5">
              <div className="flex items-center gap-2 font-semibold"><Cloud className="h-4 w-4 text-primary" /> Off-chain (privat)</div>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>Foto nota</li><li>Data transaksi sensitif</li><li>Foto barang</li><li>Manual PDF</li><li>Akun pengguna</li>
              </ul>
            </div>
            <div className="rounded-xl border bg-card p-5">
              <div className="flex items-center gap-2 font-semibold"><Database className="h-4 w-4 text-accent-foreground" /> On-chain (publik)</div>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>Receipt hash</li><li>Asset ID / serial hash</li><li>Expiry timestamp</li><li>Owner wallet address</li><li>Status garansi</li>
              </ul>
            </div>
          </section>
          <Notice tone="info">Foto nota asli tidak diunggah ke blockchain. NotaChain memberi bukti keaslian digital, tetapi klaim fisik tetap mengikuti kebijakan brand/vendor.</Notice>
        </div>

        <div className="space-y-6">
          <QRBlock code={p.code} />
          <section className="rounded-xl border bg-card p-5">
            <div className="mb-4 font-semibold">Timeline</div>
            <ol className="relative space-y-4 border-l pl-5">
              {timeline.map((t, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
                  <div className="text-sm font-medium">{t.label}</div>
                  {t.date && <div className="text-xs text-muted-foreground">{fmtDate(t.date)}</div>}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </>
  );
}
