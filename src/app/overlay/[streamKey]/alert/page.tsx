"use client";

import { useEffect, useState } from "react";
import { Alert, OverlayEvent } from "@/components/overlay/Alert";

export default function AlertOverlayPage() {
  const [alert, setAlert] = useState<OverlayEvent | null>(null);

  useEffect(() => {
    // In real app, listen to socket or SSE here
    const timer = setInterval(() => {
      // if (Math.random() > 0.6) {
      setAlert({
        type: "share",
        user: "MediaShareUser",
        // amount: 10000,
        message: "Check out this awesome song!",
        media: {
          type: "youtube",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Rick Roll for testing :D
        },
      });
      // }
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-transparent overflow-hidden">
      {alert && <Alert event={alert} onComplete={() => setAlert(null)} />}
    </div>
  );
}
