"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, History, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/history", label: "History", icon: History },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
              <Flame className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
              StreakTracker
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:block">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 sm:px-6 sm:py-12 flex flex-col relative z-0">
        {children}
      </main>

      <footer className="mt-auto border-t border-border/50 bg-background/50 backdrop-blur-sm relative z-10">
        <div className="max-w-5xl mx-auto w-full px-4 py-8 flex flex-col items-center gap-2 text-center">
          <p className="font-display font-semibold text-foreground tracking-wide">
            Developed by SMEC Student
          </p>
          <div className="flex flex-col items-center gap-0.5 text-muted-foreground">
            <p className="font-medium text-foreground/80">Bhavaniguttamedi</p>
            <a
              href="mailto:22K81A1284@gmail.com"
              className="text-sm hover:text-primary transition-colors duration-200"
            >
              22K81A1284@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
