"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListMusic,
  Settings,
  LogOut,
  History,
  Wallet,
  CreditCard,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarSections = [
  {
    title: "Main",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
      { icon: Wallet, label: "Riwayat Penarikan", href: "/dashboard/withdrawals" },
      { icon: CreditCard, label: "Payout Account", href: "/dashboard/payouts" },
      { icon: History, label: "Riwayat Dukungan", href: "/dashboard/history" },
    ],
  },
  {
    title: "Streaming Tools",
    items: [
      { icon: Layers, label: "Overlay Settings", href: "/dashboard/overlay" },
      // Add more later like Alert Box settings, etc. if needed detailed
    ],
  },
  {
    title: "Account",
    items: [{ icon: Settings, label: "Settings", href: "/dashboard/settings" }],
  },
];

// Flatten for mobile
const allSidebarItems = sidebarSections.flatMap((s) => s.items);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--color-off-white)] flex">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col fixed h-full z-20 overflow-y-auto">
        <div className="p-6 flex items-center gap-2 border-b border-slate-50 sticky top-0 bg-white z-10">
          <div className="w-8 h-8 bg-[var(--color-accent-yellow)] rounded-lg flex items-center justify-center text-[var(--color-deep-purple)] font-black text-lg shadow-sm">
            D
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">DukuNasia</span>
        </div>

        <div className="flex-1 py-6 px-4 space-y-6">
          {sidebarSections.map((section, idx) => (
            <div key={idx}>
              {section.title && (
                <h3 className="px-4 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all",
                      pathname === item.href
                        ? "bg-[var(--color-pastel-purple)] text-[var(--color-deep-purple)]"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-50 sticky bottom-0 bg-white">
          <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav (Simple implementation for now) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around p-3 z-50 overflow-x-auto">
        {allSidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl min-w-[60px]",
              pathname === item.href ? "text-[var(--color-deep-purple)]" : "text-slate-400"
            )}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-bold whitespace-nowrap">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8">{children}</main>
    </div>
  );
}
