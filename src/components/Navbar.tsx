import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, User, Menu } from "lucide-react";

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg px-6 py-4 flex justify-between items-center border-b border-slate-100/50">
            <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[var(--color-accent-yellow)] rounded-lg flex items-center justify-center text-[var(--color-deep-purple)] font-black text-lg shadow-sm">
                    D
                </div>
                <span className="font-bold text-lg tracking-tight text-slate-900">
                    DukuNasia
                </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
                <Link
                    href="/explore"
                    className="hover:text-[var(--color-deep-purple)] transition-colors"
                >
                    Explore
                </Link>
                <Link
                    href="/following"
                    className="hover:text-[var(--color-deep-purple)] transition-colors"
                >
                    Following
                </Link>
                <Link
                    href="/activity"
                    className="hover:text-[var(--color-deep-purple)] transition-colors"
                >
                    Activity
                </Link>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden md:flex gap-3">

                    <Link href="/alerts">
                        <Button variant="ghost" size="sm" className="font-bold text-xs p-2">
                            <Bell size={20} />
                        </Button>
                    </Link>
                    <Link href="/profile">
                        <Button variant="ghost" size="sm" className="font-bold text-xs p-2">
                            <User size={20} />
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button
                            size="sm"
                            className="rounded-full font-bold text-xs px-5 shadow-sm"
                        >
                            Dashboard
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Button (Placeholder) */}
                <Button variant="ghost" size="sm" className="md:hidden p-2">
                    <Menu size={24} />
                </Button>
            </div>
        </nav>
    );
}
