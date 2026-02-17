"use client";

import { useEffect, useState } from "react";
import { Alert, OverlayEvent } from "@/components/overlay/Alert";

export default function AlertOverlayPage() {
  const [alert, setAlert] = useState<OverlayEvent | null>(null);

  useEffect(() => {
    // In real app, listen to socket or SSE here
    const timer = setInterval(() => {
      if (Math.random() > 0.6) {
        setAlert({
          type: "donation",
          user: "RandomUser_" + Math.floor(Math.random() * 100),
          amount: 10000 * Math.floor(Math.random() * 10),
          message: "Semangat bang streamingnya!",
        });
      }
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-transparent overflow-hidden">
      {alert && <Alert event={alert} onComplete={() => setAlert(null)} />}
    </div>
  );
}
