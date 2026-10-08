import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Upload, Sparkles, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Notice, PageHeader } from "@/components/nc/ui";
import { passportStore } from "@/lib/store";
import { computeExpiry } from "@/lib/warranty";
import { CURRENT_USER } from "@/data/dummy";
import type { Receipt } from "@/data/types";

export const Route = createFileRoute("/app/scan")({
  head: () => ({
    meta: [
      { title: "Scan Nota — NotaChain" },
      { name: "description", content: "Unggah foto nota dan biarkan AI (simulasi) mengisi data garansi." },
      { property: "og:title", content: "Scan Nota — NotaChain" },
      { property: "og:description", content: "Unggah foto nota, data garansi terisi otomatis." },
    ],
  }),
  component: Scan,
});

const samples: Omit<Receipt, "id">[] = [
  { storeName: "Gadget Corner Mall Kota", purchaseDate: "2026-10-01", itemName: "Tablet Vega Tab 11", category: "Tablet", serialNumber: "VGT11-55120", price: 5400000, warrantyMonths: 12 },
  { storeName: "Rumah Elektronik Makmur", purchaseDate: "2026-09-27", itemName: "Kulkas Dingin 2 Pintu", category: "Peralatan Rumah", serialNumber: "DNG2P-71003", price: 6900000, warrantyMonths: 24 },
  { storeName: "Audio Hub Nusantara", purchaseDate: "2026-10-05", itemName: "Speaker Boom Mini", category: "Audio", serialNumber: "BMM-30442", price: 890000, warrantyMonths: 6 },
];

type Phase = "idle" | "scanning" | "done";

function Scan() {
  const [preview, setPreview] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [form, setForm] = useState<Omit<Receipt, "id">>(samples[0]);
  const navigate = useNavigate();

  const onFile = (f?: File) => {
    if (!f) return;
    setPreview(URL.createObjectURL(f));
    setPhase("scanning");
    setTimeout(() => {
      setForm(samples[Math.floor(Math.random() * samples.length)]);
      setPhase("done");
      toast.success("AI selesai membaca nota (simulasi)");
    }, 2000);
  };

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: k === "price" || k === "warrantyMonths" ? Number(v) : v }));

  const save = () => {
    const id = "p" + Date.now();
    const code = "NC-" + Math.random().toString(36).slice(2, 6).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    passportStore.add({
      id, code, status: "Active",
      expiryDate: computeExpiry(form.purchaseDate, form.warrantyMonths),
      ownerWallet: CURRENT_USER.wallet,
      receipt: { ...form, id: "r" + id },
      history: [{ wallet: CURRENT_USER.wallet, ownerName: CURRENT_USER.name, date: new Date().toISOString().slice(0, 10) }],
    });
    toast.success("Paspor garansi dibuat");
    navigate({ to: "/app/warranties/$id", params: { id } });
  };

  return (
    <>
      <PageHeader title="Scan Nota" desc="Unggah foto nota. AI (simulasi) akan mengisi data otomatis." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <label className="relative flex aspect-[3/4] max-h-[520px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-muted/50 text-center hover:border-primary">
            {preview ? (
              <img src={preview} alt="Pratinjau nota" className="h-full w-full object-contain" />
            ) : (
              <>
                <Upload className="h-10 w-10 text-muted-foreground" />
                <div className="mt-3 font-medium">Klik untuk unggah foto nota</div>
                <div className="text-sm text-muted-foreground">JPG / PNG · pastikan terang & tidak buram</div>
              </>
            )}
            {phase === "scanning" && (
              <>
                <div className="absolute inset-0 bg-primary/10" />
                <div className="scan-line absolute inset-x-0 h-1 bg-primary" />
                <div className="absolute bottom-4 rounded-full bg-card px-3 py-1 text-sm font-medium shadow"><Sparkles className="mr-1 inline h-4 w-4 text-accent" />AI sedang membaca…</div>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          </label>
          {preview && (
            <Button variant="ghost" size="sm" className="mt-3" onClick={() => { setPreview(null); setPhase("idle"); }}>
              <RotateCcw /> Ganti foto
            </Button>
          )}
          <p className="mt-3 text-xs text-muted-foreground">Foto nota disimpan off-chain dan tidak pernah diunggah ke blockchain.</p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-semibold">Hasil pembacaan</div>
            {phase === "done" && <span className="rounded-full bg-accent/25 px-2 py-0.5 text-xs">Terisi otomatis</span>}
          </div>
          <Notice>Hasil AI bisa salah, terutama jika foto buram. Periksa dan koreksi data di bawah sebelum menyimpan.</Notice>
          <fieldset disabled={phase === "scanning"} className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Nama toko" className="sm:col-span-2"><Input value={form.storeName} onChange={(e) => set("storeName", e.target.value)} /></Field>
            <Field label="Tanggal beli"><Input type="date" value={form.purchaseDate} onChange={(e) => set("purchaseDate", e.target.value)} /></Field>
            <Field label="Masa garansi (bulan)"><Input type="number" min={1} value={form.warrantyMonths} onChange={(e) => set("warrantyMonths", e.target.value)} /></Field>
            <Field label="Nama barang" className="sm:col-span-2"><Input value={form.itemName} onChange={(e) => set("itemName", e.target.value)} /></Field>
            <Field label="Kategori"><Input value={form.category} onChange={(e) => set("category", e.target.value)} /></Field>
            <Field label="Nomor seri"><Input value={form.serialNumber} onChange={(e) => set("serialNumber", e.target.value)} /></Field>
            <Field label="Harga (Rp)" className="sm:col-span-2"><Input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} /></Field>
          </fieldset>
          <div className="mt-4 text-sm text-muted-foreground">
            Garansi berakhir: <span className="font-mono text-foreground">{form.purchaseDate ? computeExpiry(form.purchaseDate, form.warrantyMonths || 0) : "—"}</span>
          </div>
          <Button className="mt-5 w-full" disabled={phase === "scanning" || !form.itemName || !form.storeName} onClick={save}>Simpan sebagai paspor garansi</Button>
        </div>
      </div>
    </>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return <div className={`space-y-1.5 ${className ?? ""}`}><Label>{label}</Label>{children}</div>;
}
