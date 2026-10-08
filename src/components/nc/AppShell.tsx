import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, LogOut, type LucideIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "./ui";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean | undefined;
}

function NavList({ items, onNavigate }: { items: NavItem[]; onNavigate?: (() => void) | undefined }) {
  return (
    <nav className="flex flex-col gap-1">
      {items.map((it) => (
        <Link
          key={it.to}
          to={it.to}
          onClick={onNavigate}
          activeOptions={{ exact: it.exact ?? false }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/80 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{ className: "!bg-sidebar-primary !text-sidebar-primary-foreground font-semibold" }}
        >
          <it.icon className="h-4 w-4" />
          {it.label}
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({ items, role, user, children }: { items: NavItem[]; role: string; user: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const side = (onNav?: () => void) => (
    <div className="flex h-full flex-col bg-sidebar p-4 text-sidebar-foreground">
      <Link to="/" className="mb-8 px-2 pt-2" onClick={onNav}>
        <Logo />
      </Link>
      <div className="mb-2 px-3 text-xs uppercase tracking-widest text-sidebar-foreground/50">{role}</div>
      <NavList items={items} onNavigate={onNav} />
      <div className="mt-auto rounded-lg bg-sidebar-accent p-3">
        <div className="truncate text-sm font-medium">{user}</div>
        <button
          onClick={() => navigate({ to: "/login" })}
          className="mt-2 inline-flex items-center gap-1.5 text-xs text-sidebar-foreground/70 hover:text-sidebar-primary"
        >
          <LogOut className="h-3.5 w-3.5" /> Keluar
        </button>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">{side()}</aside>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
        <Logo />
        <button aria-label="Buka menu" onClick={() => setOpen(true)} className="rounded-lg border p-2">
          <Menu className="h-5 w-5" />
        </button>
      </header>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 border-0 p-0">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          {side(() => setOpen(false))}
        </SheetContent>
      </Sheet>
      <main className="px-4 py-6 sm:px-8 sm:py-8 lg:ml-64">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
