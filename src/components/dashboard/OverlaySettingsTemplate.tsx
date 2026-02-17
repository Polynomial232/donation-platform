"use client";

import { useState } from "react";
import { ChevronLeft, Info, Check, Copy, ExternalLink, Sliders } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OverlaySettingsTemplateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  type: string; // The type used for URL e.g. 'alert'
  previewContent: React.ReactNode;
  settingsContent?: React.ReactNode;
  extraActions?: React.ReactNode;
  children?: React.ReactNode;
  layout?: 'split' | 'stacked';
}

export default function OverlaySettingsTemplate({
  title,
  description,
  icon,
  type,
  previewContent,
  settingsContent,
  extraActions,
  children,
  layout = 'split',
}: OverlaySettingsTemplateProps) {
  const streamKey = "sk_live_123456789"; // Mock
  const overlayUrl = typeof window !== 'undefined' ? `${window.location.origin}/overlay/${streamKey}/${type}` : '';
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/overlay" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ChevronLeft size={24} className="text-slate-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
            <span className="text-[var(--color-deep-purple)]">{icon}</span>
            {title}
          </h2>
          <p className="text-slate-500 font-medium">{description}</p>
        </div>
      </div>

      <div className={cn("gap-8", layout === 'split' ? "grid grid-cols-1 lg:grid-cols-3" : "flex flex-col")}>
        {/* Left Column: Preview & URL */}
        <div className={cn("space-y-6", layout === 'split' ? "lg:col-span-2" : "w-full")}>
          {/* URL Section */}
          <Card className="p-6 border-none shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-6 bg-[var(--color-accent-yellow)] rounded-full" /> Overlay URL
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-600 truncate">
                {overlayUrl}
              </div>
              <div className="flex gap-2">
                <Button onClick={copyToClipboard} variant="outline" className="gap-2">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.open(overlayUrl, '_blank')} title="Open in New Tab">
                  <ExternalLink size={18} />
                </Button>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Use this URL as a Browser Source in OBS, Streamlabs, or other streaming software.
            </p>
          </Card>

          {/* Preview Section */}
          <Card className="p-0 border-none shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-white">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-400 rounded-full" /> Preview
              </h3>
              {extraActions}
            </div>
            <div className={cn(
              "h-[400px] bg-[url('/img/transparent-grid.png')] bg-repeat relative flex items-center justify-center overflow-hidden",
              type === 'running-text' ? "items-end pb-8" : ""
            )}>
              {/* Checkerboard Pattern CSS fallback */}
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                  backgroundSize: `20px 20px`,
                  backgroundPosition: `0 0, 0 10px, 10px -10px, -10px 0px`
                }}
              />

              <div className="relative z-10 w-full h-full flex items-center justify-center">
                {previewContent}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Settings */}
        <div className={cn("space-y-6", layout === 'split' ? "" : "w-full")}>
          <Card className={cn("p-6 border-none shadow-sm space-y-6", layout === 'split' ? "h-fit sticky top-24" : "")}>
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Sliders size={20} /> Settings
            </h3>

            {settingsContent ? settingsContent : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" className="h-10 w-10 rounded-lg cursor-pointer border border-slate-200" defaultValue="#6B21A8" />
                    <span className="text-xs font-mono text-slate-500">#6B21A8</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" className="h-10 w-10 rounded-lg cursor-pointer border border-slate-200" defaultValue="#FDE047" />
                    <span className="text-xs font-mono text-slate-500">#FDE047</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Animation Duration (s)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      defaultValue="0.5"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium pr-8"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">s</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Duration for entry/exit animations.</p>
                </div>

                <div className="pt-4 border-t border-slate-50">
                  <Button className="w-full">Save Changes</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      {children}
    </div>
  );
}
