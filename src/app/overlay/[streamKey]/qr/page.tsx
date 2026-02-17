"use client";

import { QRCodeOverlay } from "@/components/overlay/QRCode";

export default function QROverlayPage() {
  return (
    <div className="p-4 bg-transparent w-fit overflow-hidden">
      <QRCodeOverlay data="https://saweria.co/yourprofile" />
    </div>
  );
}
