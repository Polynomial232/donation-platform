"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogIn, Compass, LayoutDashboard, Menu, X } from "lucide-react";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "DukuNasia";

const NAV_LINKS = [{ label: "Venture Forth", href: "/explore", icon: Compass }] as const;

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav
        className={`
          sticky top-0 z-50 transition-all duration-500 ease-out
          ${
            isScrolled
              ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-purple-100/30 border-b border-slate-100/60"
              : "bg-transparent border-b border-transparent"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="w-9 h-9 bg-linear-to-br from-(--color-accent-yellow) to-(--color-pastel-yellow) rounded-xl flex items-center justify-center text-(--color-deep-purple) font-black text-base shadow-md shadow-yellow-200/60 group-hover:shadow-lg group-hover:shadow-yellow-200/80 transition-all duration-300 group-hover:scale-105">
                  {APP_NAME.charAt(0)}
                </div>
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-(--color-deep-purple) transition-colors duration-300">
                {APP_NAME}
              </span>
            </Link>

            {/* Center Navigation — Desktop */}
            <div className="hidden md:flex items-center">
              <div className="flex items-center gap-1 bg-slate-50/80 rounded-2xl p-1 border border-slate-100/60">
                {NAV_LINKS.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`
                      relative flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300
                      ${
                        isActive(href)
                          ? "bg-white text-(--color-deep-purple) shadow-md shadow-purple-100/40"
                          : "text-slate-500 hover:text-slate-800 hover:bg-white/60"
                      }
                    `}
                  >
                    <Icon
                      size={16}
                      className={isActive(href) ? "text-(--color-deep-purple)" : ""}
                    />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2.5">
              {/* Desktop CTAs */}
              <div className="hidden md:flex items-center gap-2.5">
                {isLoggedIn ? (
                  <Link href="/dashboard">
                    <Button
                      size="sm"
                      className="rounded-xl font-bold text-xs px-5 gap-2 bg-(--color-deep-purple) text-white hover:bg-deep-purple/90 shadow-md shadow-purple-200/50 hover:shadow-lg hover:shadow-purple-200/60 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <LayoutDashboard size={14} />
                      Sovereign&apos;s Keep
                    </Button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button
                      size="sm"
                      className="rounded-xl font-bold text-xs px-5 gap-2 bg-(--color-accent-yellow) text-(--color-deep-purple) hover:bg-(--color-pastel-yellow) shadow-md shadow-yellow-200/50 hover:shadow-lg hover:shadow-yellow-200/60 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <LogIn size={14} />
                      Enter the Gates
                    </Button>
                  </Link>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                <div
                  className={`transition-all duration-300 ${isMobileMenuOpen ? "rotate-90 opacity-0 scale-50 absolute" : "rotate-0 opacity-100 scale-100"}`}
                >
                  <Menu size={20} className="text-slate-700" />
                </div>
                <div
                  className={`transition-all duration-300 ${isMobileMenuOpen ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-50 absolute"}`}
                >
                  <X size={20} className="text-slate-700" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden
          transition-opacity duration-300
          ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`
          fixed top-[64px] left-0 right-0 z-40 md:hidden
          transition-all duration-400 ease-out
          ${isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"}
        `}
      >
        <div className="mx-3 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-purple-100/30 border border-slate-100/60 overflow-hidden">
          <div className="p-4 space-y-2">
            {NAV_LINKS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                  ${
                    isActive(href)
                      ? "bg-(--color-pastel-purple) text-(--color-deep-purple)"
                      : "text-slate-600 hover:bg-slate-50 active:bg-slate-100"
                  }
                `}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-100 p-4">
            {isLoggedIn ? (
              <Link href="/dashboard" className="block">
                <Button
                  size="md"
                  className="w-full rounded-xl font-bold gap-2 bg-(--color-deep-purple) text-white hover:bg-deep-purple/90 shadow-md shadow-purple-200/50"
                >
                  <LayoutDashboard size={16} />
                  Sovereign&apos;s Keep
                </Button>
              </Link>
            ) : (
              <Link href="/login" className="block">
                <Button
                  size="md"
                  className="w-full rounded-xl font-bold gap-2 bg-(--color-accent-yellow) text-(--color-deep-purple) hover:bg-(--color-pastel-yellow) shadow-md shadow-yellow-200/50"
                >
                  <LogIn size={16} />
                  Enter the Gates
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
