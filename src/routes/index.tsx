import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Camera, FileWarning, Link2, QrCode, Bell, Repeat, ScanLine, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/nc/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NotaChain — Nota Pudar, Garansi Tetap Aman" },
      { name: "description", content: "Pencatat garansi pintar: scan nota dengan AI, terbitkan bukti on-chain, verifikasi lewat QR." },
      { property: "og:title", content: "NotaChain — Nota Pudar, Garansi Tetap Aman" },
      { property: "og:description", content: "Scan nota, terbitkan paspor garansi digital, dan verifikasi keasliannya lewat QR." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: ScanLine, title: "AI Smart Receipt Scanner", desc: "Foto nota, data toko, tanggal, barang & masa garansi terisi otomatis. Tetap bisa dikoreksi manual." },
  { icon: Bell, title: "Warranty Tracker & Reminder", desc: "Pantau sisa masa garansi tiap barang, dapat pengingat H-30 dan H-7." },
  { icon: ShieldCheck, title: "On-Chain Proof", desc: "1 klik terbitkan bukti: hash SHA-256 dari metadata nota dicatat sebagai bukti keaslian." },
  { icon: QrCode, title: "Verifiable Passport", desc: "Setiap paspor punya kode unik & QR. Calon pembeli bisa cek tanpa melihat data pribadi." },
  { icon: Repeat, title: "Ownership Transfer", desc: "Jual barang bekas? Pindahkan paspor ke pemilik baru, riwayat tercatat rapi." },
];

const steps = [
  { icon: Camera, title: "Foto nota", desc: "Unggah foto nota belanja elektronikmu." },
  { icon: ScanLine, title: "Periksa hasil AI", desc: "Cek dan koreksi data yang terbaca." },
  { icon: Link2, title: "Terbitkan paspor", desc: "Bukti on-chain + QR siap dibagikan." },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link to="/verify" className="text-sm text-muted-foreground hover:text-foreground">Verifikasi</Link>
          <Button asChild size="sm"><Link to="/login">Masuk</Link></Button>
        </nav>
      </header>

      <section className="bg-hero">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-10 lg:grid-cols-2 lg:pt-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
              Prototype · AI & blockchain disimulasikan
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Nota boleh pudar.<br />
              <span className="text-primary">Garansimu jangan.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              NotaChain mengubah nota fisik jadi paspor garansi digital yang terverifikasi — tanpa ketik manual.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/login">Mulai catat garansi <ArrowRight /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/verify">Cek keaslian garansi</Link></Button>
            </div>
          </div>
          <ReceiptMock />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-destructive"><FileWarning className="h-4 w-4" /> Masalahnya</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Nota thermal memudar dalam hitungan bulan.</h2>
          </div>
          <div className="space-y-4 text-muted-foreground">
            <p>Tinta nota kertas thermal mudah hilang karena panas dan waktu. Saat barang rusak, bukti beli sudah tak terbaca dan klaim garansi ditolak.</p>
            <p>Pembeli barang bekas juga sulit memastikan apakah garansi yang dijanjikan benar-benar asli.</p>
            <p className="font-medium text-foreground">NotaChain menyimpan datanya secara digital dan mencatat sidik jari (hash) nota sebagai bukti keaslian.</p>
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 text-ink-foreground">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-bold tracking-tight">Fitur utama</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-sidebar-border bg-sidebar-accent p-6">
                <f.icon className="h-6 w-6 text-accent" />
                <div className="mt-4 font-semibold">{f.title}</div>
                <p className="mt-2 text-sm text-ink-foreground/70">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-3xl font-bold tracking-tight">Cara kerja — 3 langkah</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="relative rounded-xl border bg-card p-6">
              <div className="font-mono text-5xl font-semibold text-accent">0{i + 1}</div>
              <s.icon className="absolute right-6 top-6 h-6 w-6 text-primary" />
              <div className="mt-3 font-semibold">{s.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-sm text-muted-foreground">
          Catatan: hasil AI bisa salah dan selalu dapat dikoreksi. NotaChain memberi bukti keaslian digital, tetapi klaim fisik tetap mengikuti kebijakan brand/vendor. Foto nota asli tidak pernah diunggah ke blockchain.
        </p>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © 2026 NotaChain · Prototype dengan data fiktif
      </footer>
    </div>
  );
}

function ReceiptMock() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="receipt-edge relative rotate-[-3deg] bg-paper p-6 pb-10 font-mono text-xs shadow-receipt">
        <div className="text-center font-semibold">TOKO ELEKTRONIK SINAR JAYA</div>
        <div className="text-center text-muted-foreground">14/09/2025 · #00213</div>
        <div className="my-3 border-t border-dashed border-foreground/30" />
        <div className="flex justify-between"><span>Laptop Orbis Pro 14</span><span>14.500.000</span></div>
        <div className="flex justify-between text-muted-foreground"><span>SN ORB14-88213</span></div>
        <div className="flex justify-between text-muted-foreground"><span>Garansi 24 bln</span></div>
        <div className="my-3 border-t border-dashed border-foreground/30" />
        <div className="flex justify-between font-semibold"><span>TOTAL</span><span>Rp14.500.000</span></div>
        <div className="mt-4 h-10 bg-[repeating-linear-gradient(90deg,var(--foreground)_0_2px,transparent_2px_5px)] opacity-60" />
        <div className="absolute inset-x-0 h-0.5 bg-primary scan-line" />
      </div>
      <div className="absolute -bottom-8 -right-2 w-60 rotate-[2deg] rounded-xl border bg-card p-4 shadow-xl sm:-right-10">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-muted-foreground">NC-7F3A-21K9</span>
          <span className="rounded-full bg-success px-2 py-0.5 text-[10px] font-semibold text-success-foreground">VALID</span>
        </div>
        <div className="mt-2 text-sm font-semibold">Paspor garansi terbit</div>
        <div className="mt-1 break-all font-mono text-[10px] text-muted-foreground">0x5e1c8a0b2f…b7f0a2c</div>
      </div>
    </div>
  );
}
