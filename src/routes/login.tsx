import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/nc/ui";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Masuk — NotaChain" },
      { name: "description", content: "Masuk atau daftar akun demo NotaChain." },
      { property: "og:title", content: "Masuk — NotaChain" },
      { property: "og:description", content: "Masuk atau daftar akun demo NotaChain." },
    ],
  }),
  component: Login,
});

function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const navigate = useNavigate();
  return (
    <div className="grid min-h-screen bg-hero place-items-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex justify-center"><Logo className="text-lg" /></Link>
        <div className="rounded-2xl border bg-card p-6 shadow-xl sm:p-8">
          <div className="mb-6 grid grid-cols-2 rounded-lg bg-muted p-1 text-sm">
            {(["login", "register"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)} className={`rounded-md py-2 font-medium ${mode === m ? "bg-card shadow" : "text-muted-foreground"}`}>
                {m === "login" ? "Masuk" : "Daftar"}
              </button>
            ))}
          </div>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/app" });
            }}
          >
            {mode === "register" && (
              <div className="space-y-1.5"><Label>Nama</Label><Input placeholder="Nama fiktif" /></div>
            )}
            <div className="space-y-1.5"><Label>Email</Label><Input type="email" placeholder="demo@notachain.test" /></div>
            <div className="space-y-1.5"><Label>Kata sandi</Label><Input type="password" placeholder="••••••••" /></div>
            <Button type="submit" className="w-full">{mode === "login" ? "Masuk sebagai Konsumen" : "Buat akun demo"}</Button>
          </form>
          <Button variant="outline" className="mt-3 w-full" onClick={() => navigate({ to: "/admin" })}>Masuk sebagai Admin (demo)</Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">Mode demo — tidak ada autentikasi sungguhan. Isian bebas.</p>
        </div>
      </div>
    </div>
  );
}
