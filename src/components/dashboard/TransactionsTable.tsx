"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import moment from "moment";
import { AlertBadge } from "@/components/ui/alert-badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  RiArrowLeftDownLine,
  RiArrowRightUpLine,
  RiPushpinLine,
  RiRestartLine,
  RiMore2Fill,
  RiPlayFill,
  RiLinkM,
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiCloseLine,
} from "@remixicon/react";

interface Transaction {
  id: number;
  name: string;
  email?: string;
  amount: number;
  message: string;
  type: "income" | "expense";
  tags?: string[];
  remarks?: string;
  time: Date;
}

interface TransactionsTableProps {
  transactions: Transaction[];
}

const allColumns = ["No", "ID", "Entity", "Type", "Amount", "Message", "Time", "Status"] as const;

export default function TransactionsTable({ transactions }: TransactionsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [visibleColumns, setVisibleColumns] = useState<string[]>([...allColumns]);
  const [searchFilter, setSearchFilter] = useState(searchParams.get("search") || "");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense" | "sensitive">(
    (searchParams.get("type") as any) || "all"
  );
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const itemsPerPage = 25;

  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [pinnedRows, setPinnedRows] = useState<Record<number, boolean>>({});

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePin = (id: number) => {
    setPinnedRows((prev) => {
      if (!prev[id] && Object.values(prev).filter((v) => v).length >= 3) {
        // Optional: Show a toast/error or just return
        return prev;
      }
      return { ...prev, [id]: !prev[id] };
    });
  };

  // 📌 Sync URL changes (e.g. back button) back to state
  useEffect(() => {
    setSearchFilter(searchParams.get("search") || "");
    setTypeFilter((searchParams.get("type") as any) || "all");
    setCurrentPage(Number(searchParams.get("page")) || 1);
  }, [searchParams]);

  const updateURL = (params: { search?: string; type?: string; page?: number }) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (params.search !== undefined) {
      if (params.search) newParams.set("search", params.search);
      else newParams.delete("search");
    }

    if (params.type !== undefined) {
      if (params.type !== "all") newParams.set("type", params.type);
      else newParams.delete("type");
    }

    if (params.page !== undefined) {
      if (params.page > 1) newParams.set("page", params.page.toString());
      else newParams.delete("page");
    }

    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  const handleSearchChange = (val: string) => {
    setSearchFilter(val);
    updateURL({ search: val, page: 1 });
  };

  const handleTypeChange = (val: "all" | "income" | "expense" | "sensitive") => {
    setTypeFilter(val);
    updateURL({ type: val, page: 1 });
  };

  const handlePageChange = (val: number) => {
    setCurrentPage(val);
    updateURL({ page: val });
  };

  const filteredData = transactions.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.message.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "sensitive" ? t.remarks?.includes("Sensitive") : t.type === typeFilter);
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleColumn = (col: string) => {
    setVisibleColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  return (
    <TooltipProvider>
      <div className="w-full space-y-3 p-3 border border-slate-800 rounded-xl bg-slate-900 shadow-xl overflow-x-auto">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <div className="flex gap-2 flex-wrap">
            <Input
              placeholder="Search transactions..."
              value={searchFilter}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-64 rounded-xl border-slate-800 h-10 bg-slate-950 text-slate-100 placeholder:text-slate-600"
            />
            <div className="flex bg-slate-950 p-1 rounded-xl ring-1 ring-slate-800">
              <button
                onClick={() => handleTypeChange("all")}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                  typeFilter === "all"
                    ? "bg-slate-800 shadow-sm text-white"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                All
              </button>
              <button
                onClick={() => handleTypeChange("income")}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                  typeFilter === "income"
                    ? "bg-slate-800 shadow-sm text-green-400"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                Income
              </button>
              <button
                onClick={() => handleTypeChange("expense")}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                  typeFilter === "expense"
                    ? "bg-slate-800 shadow-sm text-red-400"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                Expense
              </button>
              <button
                onClick={() => handleTypeChange("sensitive")}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                  typeFilter === "sensitive"
                    ? "bg-red-500/20 shadow-sm text-red-400 border border-red-500/20"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                Sensitive Only ⚠️
              </button>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-slate-800 px-4 h-10 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 rounded-xl bg-slate-900 border-slate-800 text-slate-300">
              {allColumns.map((col) => (
                <DropdownMenuCheckboxItem
                  key={col}
                  checked={visibleColumns.includes(col)}
                  onCheckedChange={() => toggleColumn(col)}
                  className="rounded-lg focus:bg-slate-800 focus:text-white"
                >
                  {col}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {Object.values(pinnedRows).some((v) => v) && (
          <div className="mb-6 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 px-1">
              <RiPushpinLine size={12} className="text-blue-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Pinned Highlights
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {transactions
                .filter((t) => pinnedRows[t.id])
                .map((t) => (
                  <div
                    key={`pinned-${t.id}`}
                    className="flex items-center justify-between bg-blue-500/5 border border-blue-500/20 rounded-xl p-2.5 pr-4 ring-1 ring-inset ring-white/5 shadow-2xl animate-in zoom-in-95 duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 ring-2 ring-blue-500/30">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`}
                        />
                        <AvatarFallback>{t.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-100">{t.name}</span>
                          <span className="text-[10px] font-medium text-green-400">
                            {formatCurrency(t.amount)}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 italic line-clamp-1 max-w-[150px]">
                          "{t.message}"
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => togglePin(t.id)}
                      className="ml-2 text-slate-600 hover:text-red-400 transition-colors"
                    >
                      <RiCloseLine size={16} />
                    </button>
                  </div>
                ))}
            </div>
            <Separator className="bg-slate-800/50 mt-4" />
          </div>
        )}

        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-slate-950/50 hover:bg-slate-950/50 border-slate-800">
              <TableHead className="w-[30px]"></TableHead>
              {visibleColumns.includes("No") && (
                <TableHead className="w-[40px] font-medium text-slate-500 uppercase text-[9px] tracking-wider text-center px-1">
                  #
                </TableHead>
              )}
              {visibleColumns.includes("ID") && (
                <TableHead className="w-[70px] font-medium text-slate-500 uppercase text-[9px] tracking-wider text-center">
                  ID
                </TableHead>
              )}
              {visibleColumns.includes("Entity") && (
                <TableHead className="w-[180px] font-medium text-slate-500 uppercase text-[9px] tracking-wider">
                  Entity
                </TableHead>
              )}
              {visibleColumns.includes("Type") && (
                <TableHead className="w-[80px] font-medium text-slate-500 uppercase text-[9px] tracking-wider text-center">
                  Type
                </TableHead>
              )}
              {visibleColumns.includes("Amount") && (
                <TableHead className="w-[110px] font-medium text-slate-500 uppercase text-[9px] tracking-wider text-center">
                  Amount
                </TableHead>
              )}
              {visibleColumns.includes("Message") && (
                <TableHead className="min-w-[150px] font-medium text-slate-500 uppercase text-[9px] tracking-wider">
                  Message
                </TableHead>
              )}
              {visibleColumns.includes("Time") && (
                <TableHead className="w-[100px] font-medium text-slate-500 uppercase text-[9px] tracking-wider text-center">
                  Time
                </TableHead>
              )}
              <TableHead className="w-[80px] font-medium text-slate-500 uppercase text-[9px] tracking-wider text-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length ? (
              paginatedData.map((t, index) => (
                <React.Fragment key={t.id}>
                  <TableRow
                    className={cn(
                      "hover:bg-slate-800/30 transition-colors border-slate-800/50 group",
                      expandedRows[t.id] && "bg-slate-800/20"
                    )}
                  >
                    <TableCell className="px-1 text-center">
                      <button
                        onClick={() => toggleRow(t.id)}
                        className="text-slate-700 hover:text-slate-400"
                      >
                        {expandedRows[t.id] ? (
                          <RiArrowUpSLine size={16} />
                        ) : (
                          <RiArrowDownSLine size={16} />
                        )}
                      </button>
                    </TableCell>
                    {visibleColumns.includes("No") && (
                      <TableCell className="text-center text-slate-400 font-medium text-xs">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                    )}
                    {visibleColumns.includes("ID") && (
                      <TableCell className="text-center">
                        <span className="text-[10px] font-mono text-slate-600 bg-slate-900 px-1 py-0.5 rounded border border-slate-800">
                          #{t.id.toString().padStart(6, "0")}
                        </span>
                      </TableCell>
                    )}
                    {visibleColumns.includes("Entity") && (
                      <TableCell className="py-1.5 px-1">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-7 w-7 ring-1 ring-slate-800 shadow-sm relative">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`}
                            />
                            <AvatarFallback className="text-[10px] bg-slate-800 text-slate-400">
                              {t.name[0]}
                            </AvatarFallback>
                            {pinnedRows[t.id] && (
                              <div className="absolute -top-1 -right-1 bg-blue-500 size-2.5 rounded-full ring-1 ring-slate-900 shadow-lg border border-white/20" />
                            )}
                          </Avatar>
                          <div className="flex flex-col text-left">
                            <span
                              className={cn(
                                "font-bold leading-tight text-xs",
                                pinnedRows[t.id] ? "text-blue-400" : "text-slate-100"
                              )}
                            >
                              {t.name}
                            </span>
                            {t.email && (
                              <span className="text-[9px] text-slate-500 font-medium">
                                {t.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.includes("Type") && (
                      <TableCell className="text-center py-1.5 px-1">
                        <AlertBadge
                          variant={t.type === "income" ? "success" : "error"}
                          icon={t.type === "income" ? RiArrowLeftDownLine : RiArrowRightUpLine}
                          label={t.type === "income" ? "Income" : "Expense"}
                          className="rounded-full px-1.5 py-0.5 text-[7px] min-w-[55px] h-4.5 justify-center"
                        />
                      </TableCell>
                    )}
                    {visibleColumns.includes("Amount") && (
                      <TableCell
                        className={cn(
                          "text-right font-medium text-xs py-1.5 pr-4",
                          t.type === "income" ? "text-green-400" : "text-red-400"
                        )}
                      >
                        {t.type === "income" ? "+" : "-"} {formatCurrency(t.amount)}
                      </TableCell>
                    )}
                    {visibleColumns.includes("Message") && (
                      <TableCell className="py-1.5 px-1 max-w-[220px]">
                        <div className="flex flex-col gap-0.5 items-start">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 italic text-[11px] line-clamp-1 leading-tight font-medium">
                              "{t.message}"
                            </span>
                            {t.remarks && !t.remarks.includes("Safe") && (
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[6px] font-medium uppercase rounded py-0 px-1 border tracking-tight h-3 leading-none",
                                  t.remarks.includes("Sensitive")
                                    ? "bg-red-950/40 text-red-500 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                                    : "bg-slate-900 text-slate-400 border-slate-800"
                                )}
                              >
                                {t.remarks.split(" ")[0]}
                              </Badge>
                            )}
                          </div>
                          {t.tags && t.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {t.tags.map((tag) => {
                                const tagStyles: Record<string, string> = {
                                  "Media Share":
                                    "bg-purple-950/50 text-purple-400 border-purple-800/50",
                                  Soundboard:
                                    "bg-indigo-950/50 text-indigo-400 border-indigo-800/50",
                                  TTS: "bg-blue-950/50 text-blue-400 border-blue-800/50",
                                  GIFT: "bg-pink-950/50 text-pink-400 border-pink-800/50",
                                  REACTION: "bg-orange-950/50 text-orange-400 border-orange-800/50",
                                };

                                return (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className={cn(
                                      "rounded px-1 py-0 text-[6px] font-medium uppercase border leading-none h-3.5 tracking-tighter",
                                      tagStyles[tag] ||
                                        "bg-slate-950/50 text-slate-500 border-slate-800"
                                    )}
                                  >
                                    {tag}
                                  </Badge>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.includes("Time") && (
                      <TableCell className="text-center text-slate-500 font-bold whitespace-nowrap text-[9px] py-1.5 px-0">
                        {moment(t.time).format("DD MMM YYYY, HH:mm")}
                      </TableCell>
                    )}
                    <TableCell className="text-center py-1.5 px-1">
                      <div
                        className={cn(
                          "flex items-center justify-center gap-1.5 transition-opacity",
                          pinnedRows[t.id] ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        )}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => togglePin(t.id)}
                              className={cn(
                                "p-1.5 rounded-lg border transition-all",
                                pinnedRows[t.id]
                                  ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                  : "bg-slate-950 border-slate-800 text-slate-500 hover:text-white"
                              )}
                            >
                              <RiPushpinLine size={14} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-950 border-slate-800 text-slate-200 text-[10px] font-bold py-1 px-2">
                            {pinnedRows[t.id] ? "Unpin from Highlights" : "Pin to Highlights"}
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 hover:text-white transition-all">
                              <RiRestartLine size={14} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-950 border-slate-800 text-slate-200 text-[10px] font-bold py-1 px-2">
                            Replay Alert Overlay
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>

                  {expandedRows[t.id] && (
                    <TableRow className="bg-slate-800/10 border-slate-800/50">
                      <TableCell colSpan={allColumns.length + 2} className="p-4">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                                Transaction Details
                              </h4>
                              <Separator className="flex-1 bg-slate-800" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <span className="text-[9px] text-slate-600 font-bold uppercase">
                                  Original Message
                                </span>
                                <p className="text-xs text-slate-200 leading-relaxed">
                                  "{t.message}"
                                </p>
                              </div>
                              <div className="space-y-1 text-right">
                                <span className="text-[9px] text-slate-600 font-bold uppercase">
                                  Transaction ID
                                </span>
                                <p className="text-[10px] font-mono text-slate-400">
                                  #TX-RKN-{t.id.toString().padStart(6, "0")}
                                </p>
                              </div>
                            </div>
                          </div>

                          {t.tags?.some((tag) =>
                            ["Media Share", "Soundboard", "TTS"].includes(tag)
                          ) && (
                            <div className="md:w-64 space-y-3">
                              <div className="flex items-center gap-2">
                                <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                                  Media Content
                                </h4>
                                <Separator className="flex-1 bg-slate-800" />
                              </div>

                              <a
                                href={`https://youtube.com/watch?v=dQw4w9WgXcQ`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden group/media block"
                              >
                                {t.tags?.includes("Media Share") ? (
                                  <>
                                    <img
                                      src={`https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg`}
                                      className="w-full h-full object-cover opacity-60 group-hover/media:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="size-10 rounded-full bg-red-600 flex items-center justify-center text-white shadow-xl group-hover/media:scale-110 transition-transform">
                                        <RiPlayFill size={20} />
                                      </div>
                                    </div>
                                    <div className="absolute bottom-2 left-2 right-2 p-2 bg-slate-900/80 backdrop-blur rounded-lg border border-white/5">
                                      <p className="text-[9px] font-bold text-slate-100 line-clamp-1">
                                        Never Gonna Give You Up - Rick Astley
                                      </p>
                                      <div className="flex items-center gap-1 mt-1">
                                        <RiLinkM size={10} className="text-slate-500" />
                                        <span className="text-[8px] text-blue-400 font-bold truncate underline uppercase">
                                          VIEW ON SOURCE
                                        </span>
                                      </div>
                                    </div>
                                  </>
                                ) : t.tags?.includes("Soundboard") ? (
                                  <div className="h-full flex flex-col items-center justify-center p-4 bg-linear-to-br from-indigo-900/20 to-slate-950 group-hover/media:bg-indigo-900/30 transition-colors">
                                    <div className="size-12 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-lg mb-3">
                                      <RiPlayFill size={24} />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-100 text-center">
                                      ANIME_WOW.MP3
                                    </p>
                                    <div className="w-full h-1 bg-slate-800 rounded-full mt-4 relative overflow-hidden">
                                      <div className="absolute inset-y-0 left-0 w-1/3 bg-indigo-500" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="h-full flex items-center justify-center p-6 text-center text-slate-500 text-[10px] italic font-medium">
                                    TTS Message active. Responding in English (USA)
                                  </div>
                                )}
                              </a>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length}
                  className="text-center py-12 text-slate-400 font-medium italic"
                >
                  No transactions found for this period.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length}{" "}
            records
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg border-slate-800 h-8 font-bold text-xs bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center justify-center p-1 bg-slate-950 ring-1 ring-slate-800 rounded-lg min-w-[32px] h-8 text-xs font-bold text-slate-100 shadow-inner">
              {currentPage}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg border-slate-800 h-8 font-bold text-xs bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
