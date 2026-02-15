import { Navbar } from "@/components/Navbar";

import { Card } from "@/components/ui/card";
import { Bell, Heart, PlayCircle } from "lucide-react";

export default function ActivityPage() {
    return (
        <main className="min-h-screen bg-[var(--color-off-white)] pb-12">
            <div className="max-w-2xl mx-auto px-4 mt-8 space-y-6">
                <h1 className="text-2xl font-extrabold text-slate-900">Activity</h1>

                <div className="space-y-4">
                    <Card className="p-4 border-none shadow-sm flex gap-4 items-start">
                        <div className="bg-red-100 p-2 rounded-full text-red-600"><Heart size={20} fill="currentColor" /></div>
                        <div>
                            <p className="text-sm text-slate-800"><span className="font-bold">Windah Basudara</span> liked your donation message.</p>
                            <p className="text-xs text-slate-400 font-bold mt-1">2 hours ago</p>
                        </div>
                    </Card>
                    <Card className="p-4 border-none shadow-sm flex gap-4 items-start">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600"><PlayCircle size={20} /></div>
                        <div>
                            <p className="text-sm text-slate-800"><span className="font-bold">GadgetIn</span> requested media is playing now.</p>
                            <p className="text-xs text-slate-400 font-bold mt-1">5 hours ago</p>
                        </div>
                    </Card>
                    <Card className="p-4 border-none shadow-sm flex gap-4 items-start">
                        <div className="bg-[var(--color-pastel-purple)] p-2 rounded-full text-[var(--color-deep-purple)]"><Bell size={20} /></div>
                        <div>
                            <p className="text-sm text-slate-800">System update: New payment method available (ShopeePay).</p>
                            <p className="text-xs text-slate-400 font-bold mt-1">1 day ago</p>
                        </div>
                    </Card>
                </div>
            </div>

        </main>
    );
}
