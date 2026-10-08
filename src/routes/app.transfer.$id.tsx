import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState, Notice, PageHeader, StatusBadge } from "@/components/nc/ui";
import { passportStore, usePassport } from "@/lib/store";
import { effectiveStatus, fmtDate, isValidDummyWallet, randomHex, shortHash } from "@/lib/warranty";

export const Route = createFileRoute("/app/transfer/$id")({
  head: () => ({
    meta: [
      { title: "Transfer Kepemilikan — NotaChain" },
      { name: "description", content: "Pindahkan paspor garansi ke pemilik baru." },
      { property: "og:title", content: "Transfer Kepemilikan — NotaChain" },
      { property: "og:description", content: "Pindahkan paspor garansi ke pemilik baru." },
    ],
  }),
  component: Transfer,
});

function Transfer() {
  const { id } = Route.useParams();
  const p = usePassport(id);
  const [wallet, setWallet] = useState("");
  const [name, setName] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  if (!p) return <EmptyState title="Paspor tidak ditemukan" />;
  const status = effectiveStatus(p);
  const valid = isValidDummyWallet(wallet);
  const canTransfer = status === "Active";

  const doTransfer = async () => {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 1200));
    const txHash = randomHex();
    passportStore.update(p.id, {
      status: "Transferred",
      ownerWallet: wallet,
      history: [...p.history, { wallet, ownerName: name || "Pemilik baru (fiktif)", date: new Date().toISOString().slice(0, 10), txHash }],
    });
    setBusy(false);
    setConfirm(false);
    toast.success("Kepemilikan berhasil ditransfer (simulasi)");
  };

  return (
    <>
      <Link to="/app/warranties/$id" params={{ id }} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Kembali ke paspor</Link>
      <PageHeader title="Transfer Kepemilikan" desc={`${p.receipt.itemName} · ${p.code}`} action={<StatusBadge status={status} />} />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border bg-card p-5">
          <Notice>Hanya masukkan alamat wallet dummy. NotaChain tidak pernah meminta private key, seed phrase, atau nomor kartu.</Notice>
          {!canTransfer && <Notice tone="info">Paspor berstatus {status} sehingga tidak dapat ditransfer.</Notice>}
          <div className="space-y-1.5">
            <Label>Alamat wallet penerima</Label>
            <Input className="font-mono" placeholder="0x… (40 karakter)" value={wallet} onChange={(e) => setWallet(e.target.value.trim())} disabled={!canTransfer} />
            {wallet && !valid && <p className="text-xs text-destructive">Format tidak valid. Gunakan 0x diikuti 40 karakter.</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Nama penerima (opsional)</Label>
            <Input placeholder="Nama fiktif" value={name} onChange={(e) => setName(e.target.value)} disabled={!canTransfer} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button disabled={!canTransfer || !valid} onClick={() => setConfirm(true)}>Lanjutkan transfer</Button>
            <Button variant="ghost" disabled={!canTransfer} onClick={() => setWallet(randomHex(40))}>Isi wallet dummy</Button>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="mb-4 font-semibold">Riwayat pemilik</div>
          <ol className="space-y-3">
            {p.history.map((h, i) => (
              <li key={i} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{h.ownerName}</div>
                  <div className="truncate font-mono text-xs text-muted-foreground">{h.wallet}</div>
                  {h.txHash && <div className="font-mono text-xs text-muted-foreground">tx {shortHash(h.txHash)}</div>}
                </div>
                <div className="shrink-0 text-right text-xs text-muted-foreground">
                  {fmtDate(h.date)}
                  {i === p.history.length - 1 && <div className="mt-1 font-semibold text-primary">Saat ini</div>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi transfer</DialogTitle>
            <DialogDescription>Paspor akan dipindahkan dan status berubah menjadi "Transferred". Tindakan ini tidak dapat dibatalkan.</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-muted p-3 text-sm">
            <div className="text-muted-foreground">Penerima</div>
            <div className="break-all font-mono text-xs">{wallet}</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(false)}>Batal</Button>
            <Button onClick={doTransfer} disabled={busy}>{busy && <Loader2 className="animate-spin" />} Konfirmasi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
