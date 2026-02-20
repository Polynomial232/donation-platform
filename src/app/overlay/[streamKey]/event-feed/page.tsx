"use client";

import { EventFeed } from "@/components/overlay/EventFeed";

const MOCK_EVENTS = [
  { id: "1", user: "Budi01", action: "donated IDR 20.000", time: "2m ago" },
  { id: "2", user: "Siti_G", action: "subscribed (Prime)", time: "5m ago" },
  { id: "3", user: "Udin_World", action: "followed", time: "10m ago" },
];

export default function EventFeedOverlayPage() {
  return (
    <div className="p-4 bg-transparent w-fit flex justify-end overflow-hidden">
      <EventFeed events={MOCK_EVENTS} />
    </div>
  );
}
