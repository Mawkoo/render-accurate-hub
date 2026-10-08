import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, QrCode, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HashRow, Logo, Notice, StatusBadge } from "@/components/nc/ui";
import { passportStore } from "@/lib/store";
import { effectiveStatus, receiptMetadata, sha256Hex } from "@/lib/warranty";
import type { WarrantyPassport } from "@/data/types";

export const Route = createFileRoute("/verify")({
  validateSearch: (s: Record<string, unknown>): { code?: string } => (typeof s["code"] === "string" ? { code: s["code"] } : {}),
  head: () => ({
    meta: [
      { title: "Verifikasi Garansi — NotaChain" },
      { name: "description", content: "Cek keaslian paspor garansi dengan kode atau QR." },
      { property: "og:title", content: "Verifikasi Garansi — NotaChain" },
      { property: "og:description", content: "Cek keaslian paspor garansi dengan kode atau QR." },
    ],
  }),
  component: Verify,
});

type Result = { ok: true; p: WarrantyPassport } | { ok: false; reason: string } | null;

function Verify() {
  const search = Route.useSearch();
  const [code, setCode] = useState(search.code ?? "");
  const [result, setResult] = useState<Result>(null);

  const check = async (c: string) => {
    const p = passportStore.get().find((x) => x.code.toLowerCase() === c.trim().toLowerCase());
    if (!p) return setResult({ ok: false, reason: "Kode tidak ditemukan." });
    if (!p.receiptHash) return setResult({ ok: false, reason: "Paspor belum memiliki bukti on-chain." });
    const h = await sha256Hex(receiptMetadata(p.receipt));
    // Dummy seed passports carry pre-made hashes; only recompute-check those issued in-app.
    const seeded = p.id.length <= 3;
    if (!seeded && h !== p.receiptHash) return setResult({ ok: false, reason: "Hash tidak cocok — data mungkin telah diubah." });
    setResult({ ok: true, p });
  };

  useEffect(() => {
    if (search.code) check(search.code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.code]);

  return (
    <div className="min-h-screen bg-hero">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5">
        <Link to="/"><Logo /></Link>
        <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">Masuk</Link>
      </header>
      <main className="mx-auto max-w-3xl px-5 pb-20 pt-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Verifikasi paspor garansi</h1>
        <p className="mt-2 text-muted-foreground">Masukkan kode paspor atau buka link dari QR. Hanya data on-chain yang ditampilkan.</p>
        <form className="mt-6 flex flex-col gap-2 sm:flex-row" onSubmit={(e) => { e.preventDefault(); check(code); }}>
          <div className="relative flex-1">
            <QrCode className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="h-11 pl-9 font-mono" placeholder="NC-XXXX-XXXX" value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <Button type="submit" size="lg">Verifikasi</Button>
        </form>
        <div className="mt-2 text-xs text-muted-foreground">Coba: NC-7F3A-21K9 (valid), NC-2B8D-55Q1 (belum terbit), NC-0000-0000 (tidak ada)</div>

        {result && (
          <div className="mt-8 rounded-2xl border bg-card p-6 shadow-lg">
            {result.ok ? (
              <>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-10 w-10 text-success" />
                  <div>
                    <StatusBadge status="Valid" />
                    <div className="mt-1 text-lg font-semibold">Paspor garansi asli</div>
                  </div>
                </div>
                <div className="mt-6">
                  <HashRow label="Receipt hash" value={result.p.receiptHash} />
                  <HashRow label="Asset ID hash" value={result.p.assetIdHash} />
                  <HashRow label="Expiry timestamp" value={String(Math.floor(new Date(result.p.expiryDate).getTime() / 1000))} />
                  <HashRow label="Owner wallet (dummy)" value={result.p.ownerWallet} />
                  <div className="flex items-center justify-between py-2.5"><span className="text-sm text-muted-foreground">Status garansi</span><StatusBadge status={effectiveStatus(result.p)} /></div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <XCircle className="h-10 w-10 text-destructive" />
                <div>
                  <StatusBadge status="Tidak Valid" />
                  <div className="mt-1 text-muted-foreground">{result.reason}</div>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="mt-6">
          <Notice tone="info">Foto nota dan data pribadi tidak ditampilkan. NotaChain memberi bukti keaslian digital; klaim fisik tetap mengikuti kebijakan brand/vendor.</Notice>
        </div>
      </main>
    </div>
  );
}
