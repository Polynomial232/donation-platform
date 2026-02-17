"use client";

import { List } from "lucide-react";
import { EventFeed } from "@/components/overlay/EventFeed";
import OverlaySettingsTemplate from "@/components/dashboard/OverlaySettingsTemplate";

const MOCK_EVENTS = [
  { id: "1", user: "Budi01", action: "donated Rp 20.000", time: "2m ago" },
  { id: "2", user: "Siti_G", action: "subscribed (Prime)", time: "5m ago" },
  { id: "3", user: "Udin_World", action: "followed", time: "10m ago" },
];

export default function EventFeedOverlaySettingsPage() {
  return (
    <OverlaySettingsTemplate
      title="Event Feed"
      description="Show a list of recent stream activities."
      icon={<List size={24} />}
      type="event-feed"
      previewContent={
        <div className="flex justify-end w-full pr-10">
          <EventFeed events={MOCK_EVENTS} />
        </div>
      }
    />
  );
}
