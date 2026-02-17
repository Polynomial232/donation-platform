"use client";

import { QrCode } from "lucide-react";
import { QRCodeOverlay } from "@/components/overlay/QRCode";
import OverlaySettingsTemplate from "@/components/dashboard/OverlaySettingsTemplate";
import { Button } from "@/components/ui/button";

export default function QROverlaySettingsPage() {
  return (
    <OverlaySettingsTemplate
      title="QR Code"
      description="Scan to donate directly."
      icon={<QrCode size={24} />}
      type="qr"
      previewContent={
        <QRCodeOverlay data="https://example.com" />
      }
      settingsContent={
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Target URL</label>
            <input type="text" className="w-full p-2.5 rounded-xl border border-slate-200" defaultValue="https://saweria.co/yourprofile" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Size (px)</label>
            <input type="number" className="w-full p-2.5 rounded-xl border border-slate-200" defaultValue="120" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Label</label>
            <input type="text" className="w-full p-2.5 rounded-xl border border-slate-200" defaultValue="Scan to Donate" />
          </div>

          <div className="pt-4 border-t border-slate-50">
            <Button className="w-full">Save QR Settings</Button>
          </div>
        </div>
      }
    />
  );
}
