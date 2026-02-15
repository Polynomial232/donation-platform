"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlProps {
    currentPage: number;
    totalPages: number;
    limit: number;
    totalEntries: number;
}

export function PaginationControl({
    currentPage,
    totalPages,
    limit,
    totalEntries,
}: PaginationControlProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const onPageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };

    const onLimitChange = (newLimit: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("limit", newLimit.toString());
        params.set("page", "1"); // Reset to page 1 when limit changes
        router.push(`?${params.toString()}`);
    };

    const startEntry = (currentPage - 1) * limit + 1;
    const endEntry = Math.min(currentPage * limit, totalEntries);

    return (
        <div className="flex items-center justify-between px-2 py-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>Show</span>
                <select
                    value={limit}
                    onChange={(e) => onLimitChange(Number(e.target.value))}
                    className="h-8 w-16 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    {[5, 10, 20, 50].map((value) => (
                        <option key={value} value={value}>
                            {value}
                        </option>
                    ))}
                </select>
                <span>entries</span>
            </div>

            <div className="text-sm text-slate-500">
                Showing {totalEntries === 0 ? 0 : startEntry} to {endEntry} of {totalEntries} entries
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            variant={currentPage === page ? "primary" : "outline"}
                            size="sm"
                            className={`h-8 w-8 p-0 ${currentPage === page
                                    ? "bg-[var(--color-primary)] text-primary-foreground hover:bg-[var(--color-primary)]/90"
                                    : ""
                                }`}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </Button>
                    ))}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
