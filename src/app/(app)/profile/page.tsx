import { Navbar } from "@/components/Navbar";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, CreditCard, LogOut, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
    return (
        <main className="min-h-screen bg-[var(--color-off-white)] pb-12">
            <div className="max-w-md mx-auto px-4 space-y-8">
                <h1 className="text-2xl font-extrabold text-slate-900">Profile</h1>

                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-sm overflow-hidden relative bg-white">
                        <Image src="https://i.imgur.com/1Z3MVNG.jpeg" alt="You" fill className="object-cover" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Guest User</h2>
                        <p className="text-sm text-slate-500">guest@example.com</p>
                        <Button variant="ghost" size="sm" className="text-[var(--color-deep-purple)] px-0 font-bold h-auto mt-1 hover:bg-transparent">
                            Edit Profile
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Account</h3>
                    <Card className="border-none shadow-sm divide-y divide-slate-50 overflow-hidden">
                        <Link href="#" className="block hover:bg-slate-50 transition-colors">
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <User size={18} className="text-slate-400" />
                                    <span className="text-sm font-bold text-slate-700">Personal Info</span>
                                </div>
                                <ChevronRight size={16} className="text-slate-300" />
                            </div>
                        </Link>
                        <Link href="#" className="block hover:bg-slate-50 transition-colors">
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Mail size={18} className="text-slate-400" />
                                    <span className="text-sm font-bold text-slate-700">Email Settings</span>
                                </div>
                                <ChevronRight size={16} className="text-slate-300" />
                            </div>
                        </Link>
                    </Card>

                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Payment</h3>
                    <Card className="border-none shadow-sm divide-y divide-slate-50 overflow-hidden">
                        <Link href="#" className="block hover:bg-slate-50 transition-colors">
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CreditCard size={18} className="text-slate-400" />
                                    <span className="text-sm font-bold text-slate-700">Payment Methods</span>
                                </div>
                                <ChevronRight size={16} className="text-slate-300" />
                            </div>
                        </Link>
                        <Link href="#" className="block hover:bg-slate-50 transition-colors">
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 flex items-center justify-center font-bold text-slate-500 text-xs border rounded">$</div>
                                    <span className="text-sm font-bold text-slate-700">Transaction History</span>
                                </div>
                                <ChevronRight size={16} className="text-slate-300" />
                            </div>
                        </Link>
                    </Card>
                </div>

                <Button variant="outline" className="w-full rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100 font-bold gap-2">
                    <LogOut size={16} />
                    Sign Out
                </Button>
            </div>

        </main>
    );
}
