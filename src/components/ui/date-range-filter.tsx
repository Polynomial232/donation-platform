"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { parseISO, format } from "date-fns";
import CalendarWithPresets from "@/components/dashboard/CalendarWithPresets";

export function DateRangeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getInitialDate = (): DateRange | undefined => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    if (from && to) {
      try {
        return { from: parseISO(from), to: parseISO(to) };
      } catch {
        // fallback
      }
    }

    // Default to "Last Month" as requested
    const today = new Date();
    const lastMonth = {
      from: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      to: new Date(today.getFullYear(), today.getMonth(), 0),
    };
    return lastMonth;
  };

  const [date, setDate] = useState<DateRange | undefined>(getInitialDate());

  useEffect(() => {
    // Sync URL params to state if they change externally (e.g. back button)
    setDate(getInitialDate());
  }, [searchParams]);

  const handleSetDate = (newDate: DateRange | undefined) => {
    setDate(newDate);
    const params = new URLSearchParams(searchParams.toString());

    if (newDate?.from) {
      params.set("from", format(newDate.from, "yyyy-MM-dd"));
    } else {
      params.delete("from");
    }

    if (newDate?.to) {
      params.set("to", format(newDate.to, "yyyy-MM-dd"));
    } else {
      params.delete("to");
    }

    params.set("page", "1"); // Reset to page 1
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return <CalendarWithPresets date={date} setDate={handleSetDate} />;
}
