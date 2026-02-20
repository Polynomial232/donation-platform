import { Navbar } from "@/components/Navbar";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BellRing, Volume2, Settings } from "lucide-react";

export default function AlertsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-off-white)] pb-12">
      <div className="max-w-2xl mx-auto px-4 mt-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-slate-900">My Alerts</h1>
          <Button variant="outline" size="sm" className="rounded-xl">
            <Settings size={16} />
          </Button>
        </div>

        <Card className="p-6 border-none shadow-sm text-center py-12 space-y-4">
          <div className="mx-auto w-16 h-16 bg-[var(--color-pastel-yellow)] rounded-full flex items-center justify-center text-[var(--color-deep-purple)] mb-4">
            <BellRing size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No active alerts</h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            You have no pending notifications or critical alerts at the moment.
          </p>
        </Card>

        <h3 className="font-bold text-slate-800 mt-8">Notification Settings</h3>
        <Card className="divide-y divide-slate-50 border-none shadow-sm overflow-hidden">
          <div className="p-4 flex items-center justify-between hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-2 rounded-lg">
                <BellRing size={16} className="text-slate-600" />
              </div>
              <span className="text-sm font-bold text-slate-700">Push Notifications</span>
            </div>
            <div className="w-10 h-6 bg-[var(--color-accent-yellow)] rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-2 rounded-lg">
                <Volume2 size={16} className="text-slate-600" />
              </div>
              <span className="text-sm font-bold text-slate-700">Sound Effects</span>
            </div>
            <div className="w-10 h-6 bg-slate-200 rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
