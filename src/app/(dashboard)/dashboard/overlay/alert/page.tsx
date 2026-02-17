"use client";

import { useState } from "react";
import { Bell, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, OverlayEvent } from "@/components/overlay/Alert";
import OverlaySettingsTemplate from "@/components/dashboard/OverlaySettingsTemplate";

export default function AlertOverlaySettingsPage() {
  const [testAlert, setTestAlert] = useState<OverlayEvent | null>(null);

  const handleTest = () => {
    setTestAlert({
      type: "donation",
      user: "Test_User",
      amount: 50000,
      message: "This is a test donation message from the dashboard!",
    });
  };

  return (
    <OverlaySettingsTemplate
      title="Notification Box"
      description="Configure alerts for donations, subscriptions, follows, and more."
      icon={<Bell size={24} />}
      type="alert"
      previewContent={
        testAlert ? (
          <Alert event={testAlert} onComplete={() => setTestAlert(null)} />
        ) : (
          <div className="text-center space-y-2">
            <p className="text-slate-400 font-medium">No active notification.</p>
            <p className="text-xs text-slate-300">Click "Test Notification" to see a preview.</p>
          </div>
        )
      }
      extraActions={
        <Button onClick={handleTest} size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Play size={14} /> Test Notification
        </Button>
      }
    />
  );
}
