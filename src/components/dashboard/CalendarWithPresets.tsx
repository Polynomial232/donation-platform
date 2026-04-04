"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DateRange } from "react-day-picker";
import {
  subDays,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  format,
} from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface CalendarWithPresetsProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  className?: string;
}

export default function CalendarWithPresets({
  date,
  setDate,
  className,
}: CalendarWithPresetsProps) {
  const today = new Date();

  // 📌 Define Presets
  const presets: Record<string, { from: Date; to: Date }> = {
    Today: { from: today, to: today },
    Yesterday: { from: subDays(today, 1), to: subDays(today, 1) },
    "Last 7 Days": { from: subDays(today, 6), to: today },
    "Last 14 Days": { from: subDays(today, 13), to: today },
    "Last 30 Days": { from: subDays(today, 29), to: today },
    "Last 90 Days": { from: subDays(today, 89), to: today },
    "Month to Date": { from: startOfMonth(today), to: today },
    "Quarter to Date": { from: startOfQuarter(today), to: today },
    "Year to Date": { from: startOfYear(today), to: today },
    "Last Month": {
      from: startOfMonth(subDays(startOfMonth(today), 1)),
      to: endOfMonth(subDays(startOfMonth(today), 1)),
    },
    "Last Quarter": {
      from: startOfQuarter(subDays(startOfQuarter(today), 1)),
      to: endOfQuarter(subDays(startOfQuarter(today), 1)),
    },
    "Last Year": {
      from: startOfYear(subDays(startOfYear(today), 1)),
      to: endOfYear(subDays(startOfYear(today), 1)),
    },
  };

  const [month, setMonth] = useState<Date>(today);

  // 📌 Dynamic height lock (card matches calendar height)
  const calendarRef = useRef<HTMLDivElement>(null);
  const [calendarHeight, setCalendarHeight] = useState<number>(0);

  useEffect(() => {
    if (calendarRef.current) {
      setCalendarHeight(calendarRef.current.offsetHeight);
    }
  }, [month]);

  return (
    <div className={cn("grid gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            size="sm"
            className={cn(
              "w-fit justify-start text-left font-medium border-slate-800 rounded-xl h-10 px-4 bg-slate-950 text-slate-500 hover:bg-slate-800 flex items-center",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span className="text-slate-500">Pick a date</span>
            )}
            <ChevronDown className="ml-2 h-4 w-4 text-slate-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-auto p-0 rounded-xl bg-slate-900 shadow-2xl border-slate-800"
          align="end"
        >
          <div className="flex max-sm:flex-col p-2 text-slate-100">
            {/* Sidebar Presets with Scroll */}
            <div
              className="sm:w-40 border-r border-slate-800 pr-2 max-sm:border-b max-sm:mb-2 overflow-y-auto"
              style={{ maxHeight: Math.max(calendarHeight, 340) }}
            >
              <div className="flex flex-col gap-1">
                {Object.entries(presets).map(([label, range]) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "justify-start w-full text-xs font-medium rounded-lg hover:bg-slate-800 hover:text-white",
                      date?.from?.getTime() === range.from.getTime() &&
                        date?.to?.getTime() === range.to.getTime()
                        ? "bg-slate-800 text-white"
                        : "text-slate-400"
                    )}
                    onClick={() => {
                      setDate(range);
                      setMonth(range.to);
                    }}
                  >
                    {label}
                  </Button>
                ))}

                <Separator className="my-1 border-slate-800" />

                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start w-full text-xs font-bold rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-500"
                  onClick={() => {
                    setDate(undefined);
                  }}
                >
                  Reset to Default
                </Button>
              </div>
            </div>

            <Separator className="sm:hidden my-2" />

            {/* Calendar */}
            <div className="flex-1 flex justify-center" ref={calendarRef}>
              <Calendar
                mode="range"
                month={month}
                onMonthChange={setMonth}
                selected={date}
                onSelect={setDate}
                className="bg-transparent p-2"
                disabled={[{ after: today }]}
              />
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
