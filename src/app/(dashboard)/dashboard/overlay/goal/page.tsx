"use client";

import { Flag } from "lucide-react";
import { Goal } from "@/components/overlay/Goal";
import OverlaySettingsTemplate from "@/components/dashboard/OverlaySettingsTemplate";
import { Button } from "@/components/ui/button";

export default function GoalOverlaySettingsPage() {
  return (
    <OverlaySettingsTemplate
      title="Target / Goal"
      description="Set up donation goals to encourage support."
      icon={<Flag size={24} />}
      type="goal"
      previewContent={
        <div className="scale-125 origin-center">
          <Goal title="Donation Goal" current={1500000} target={5000000} />
        </div>
      }
      settingsContent={
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
            <input type="text" className="w-full p-2.5 rounded-xl border border-slate-200" defaultValue="Donation Goal" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Target Amount</label>
            <input type="number" className="w-full p-2.5 rounded-xl border border-slate-200" defaultValue="5000000" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Initial Amount</label>
            <input type="number" className="w-full p-2.5 rounded-xl border border-slate-200" defaultValue="0" />
          </div>
          {/* Common color settings could be re-added here or inherited */}
          <div className="pt-4 border-t border-slate-50">
            <Button className="w-full">Save Goal</Button>
          </div>
        </div>
      }
    />
  );
}
