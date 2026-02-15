"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function DateRangeFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [startDate, setStartDate] = useState(searchParams.get("from") || "");
    const [endDate, setEndDate] = useState(searchParams.get("to") || "");

    useEffect(() => {
        setStartDate(searchParams.get("from") || "");
        setEndDate(searchParams.get("to") || "");
    }, [searchParams]);

    const updateFilters = (start: string, end: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (start) params.set("from", start);
        else params.delete("from");

        if (end) params.set("to", end);
        else params.delete("to");

        params.set("page", "1"); // Reset to page 1
        router.push(`?${params.toString()}`);
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStart = e.target.value;
        setStartDate(newStart);
        updateFilters(newStart, endDate);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEnd = e.target.value;
        setEndDate(newEnd);
        updateFilters(startDate, newEnd);
    };

    const clearFilters = () => {
        setStartDate("");
        setEndDate("");
        const params = new URLSearchParams(searchParams.toString());
        params.delete("from");
        params.delete("to");
        params.set("page", "1");
        router.push(`?${params.toString()}`);
    };

    const hasFilters = startDate || endDate;

    return (
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Filter Date:</span>
                <input
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="h-8 text-xs border border-slate-200 rounded px-2 text-slate-600 focus:outline-none focus:border-blue-500"
                />
                <span className="text-slate-400">-</span>
                <input
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="h-8 text-xs border border-slate-200 rounded px-2 text-slate-600 focus:outline-none focus:border-blue-500"
                />
            </div>
            {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 w-8 p-0 text-slate-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
}
