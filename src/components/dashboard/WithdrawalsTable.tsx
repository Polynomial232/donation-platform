"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import moment from "moment";
import {
  RiArrowRightUpLine,
  RiPushpinLine,
  RiPrinterLine,
  RiAlarmWarningLine,
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiFilter3Line,
  RiBankLine,
  RiWallet3Line,
  RiShieldCheckLine,
  RiTimerLine,
  RiCloseCircleLine,
  RiCheckboxCircleLine,
} from "@remixicon/react";

interface Withdrawal {
  id: number | string;
  name: string;
  accountNumber: string;
  amount: number;
  fees: number;
  status: "success" | "pending" | "failed";
  time: Date;
}

interface WithdrawalsTableProps {
  withdrawals: Withdrawal[];
}

const allColumns = [
  "No",
  "ID",
  "Destination",
  "Total magnitude",
  "Protocol Fees",
  "Net Magnitude",
  "Status",
  "Time",
] as const;

export default function WithdrawalsTable({ withdrawals }: WithdrawalsTableProps) {
  const [visibleColumns, setVisibleColumns] = useState<string[]>([...allColumns]);
  const [searchFilter, setSearchFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const filteredData = withdrawals.filter((w) => {
    return (
      w.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      w.id.toString().toLowerCase().includes(searchFilter.toLowerCase())
    );
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
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-emerald-400/10 text-emerald-400 border-emerald-400/20 font-black text-[8px] uppercase tracking-[0.2em] rounded-md px-2 h-5 flex items-center gap-1 w-fit mx-auto shadow-[0_0_15px_rgba(52,211,153,0.1)]">
            <RiCheckboxCircleLine size={10} /> FULFILLED
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20 font-black text-[8px] uppercase tracking-[0.2em] rounded-md px-2 h-5 flex items-center gap-1 w-fit mx-auto animate-pulse shadow-[0_0_15px_rgba(234,179,8,0.1)]">
            <RiTimerLine size={10} /> OVERSIGHT
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-400/10 text-red-400 border-red-400/20 font-black text-[8px] uppercase tracking-[0.2em] rounded-md px-2 h-5 flex items-center gap-1 w-fit mx-auto shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <RiCloseCircleLine size={10} /> REJECTED
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-800 text-slate-400 border-slate-700 font-black text-[8px] uppercase tracking-[0.2em] rounded-md px-2 h-5 w-fit mx-auto">
            UNKNOWN
          </Badge>
        );
    }
  };

  return (
    <div className="w-full space-y-3 p-3 border border-slate-800 rounded-xl bg-slate-900 shadow-2xl overflow-x-auto selection:bg-yellow-400/30">
      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <div className="flex gap-2 flex-wrap">
          <Input
            placeholder="Search manifests..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-64 rounded-xl border-slate-800 h-10 bg-slate-950 text-slate-100 placeholder:text-slate-600 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all"
          />
          <div className="flex bg-slate-950 p-1 rounded-xl ring-1 ring-slate-800">
            <button className="px-4 py-1.5 text-xs font-black rounded-lg bg-slate-800 shadow-sm text-white uppercase tracking-widest">
              Total Logs
            </button>
            <button className="px-4 py-1.5 text-xs font-black rounded-lg text-slate-500 hover:text-slate-300 uppercase tracking-widest">
              Fulfillments
            </button>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-slate-800 px-4 h-10 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white font-black text-[10px] uppercase tracking-widest"
            >
              <RiFilter3Line size={16} className="mr-2" /> Adjust Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 rounded-xl bg-slate-900 border-slate-800 text-slate-300">
            {allColumns.map((col) => (
              <DropdownMenuCheckboxItem
                key={col}
                checked={visibleColumns.includes(col)}
                onCheckedChange={() => toggleColumn(col)}
                className="rounded-lg focus:bg-slate-800 focus:text-white font-bold text-[10px] uppercase tracking-wider"
              >
                {col}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-slate-950/50 hover:bg-slate-950/50 border-slate-800">
            {visibleColumns.includes("No") && (
              <TableHead className="w-[40px] font-medium text-slate-500 uppercase text-[9px] tracking-wider text-center px-1">
                #
              </TableHead>
            )}
            {visibleColumns.includes("ID") && (
              <TableHead className="w-[100px] font-medium text-slate-500 uppercase text-[9px] tracking-wider text-center">
                Protocol ID
              </TableHead>
            )}
            {visibleColumns.includes("Destination") && (
              <TableHead className="w-[220px] font-medium text-slate-500 uppercase text-[9px] tracking-wider italic">
                Waypoint Destination
              </TableHead>
            )}
            {visibleColumns.includes("Total magnitude") && (
              <TableHead className="w-[130px] font-medium text-slate-500 uppercase text-[9px] tracking-wider text-center">
                Gross Magnitude
              </TableHead>
            )}
            {visibleColumns.includes("Protocol Fees") && (
              <TableHead className="w-[110px] font-medium text-slate-500 uppercase text-[9px] tracking-wider text-center">
                Admin Fees
              </TableHead>
            )}
            {visibleColumns.includes("Net Magnitude") && (
              <TableHead className="w-[130px] font-medium text-slate-500 uppercase text-[9px] tracking-wider text-center">
                Net Settlement
              </TableHead>
            )}
            {visibleColumns.includes("Status") && (
              <TableHead className="w-[120px] font-medium text-slate-500 uppercase text-[9px] tracking-wider text-center">
                Protocol State
              </TableHead>
            )}
            {visibleColumns.includes("Time") && (
              <TableHead className="w-[140px] font-medium text-slate-500 uppercase text-[9px] tracking-wider text-center">
                Timestamp
              </TableHead>
            )}
            <TableHead className="w-[80px] font-medium text-slate-500 uppercase text-[9px] tracking-wider text-center">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length ? (
            paginatedData.map((w, index) => (
              <TableRow
                key={w.id}
                className="hover:bg-slate-800/20 transition-colors border-slate-800/50 group"
              >
                {visibleColumns.includes("No") && (
                  <TableCell className="text-center text-slate-600 font-bold text-xs">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                )}
                {visibleColumns.includes("ID") && (
                  <TableCell className="text-center">
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800 group-hover:border-slate-700 transition-colors">
                      #{w.id}
                    </span>
                  </TableCell>
                )}
                {visibleColumns.includes("Destination") && (
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 group-hover:border-slate-700 transition-colors">
                        <RiBankLine
                          className="text-slate-600 group-hover:text-yellow-400 transition-colors"
                          size={16}
                        />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-slate-100 text-xs uppercase italic tracking-tight">
                          {w.name}
                        </span>
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-0.5">
                          {w.accountNumber}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.includes("Total magnitude") && (
                  <TableCell className="text-center font-bold text-slate-400 text-xs tabular-nums py-4">
                    {formatCurrency(w.amount)}
                  </TableCell>
                )}
                {visibleColumns.includes("Protocol Fees") && (
                  <TableCell className="text-center text-slate-500 font-bold text-[10px] tabular-nums py-4">
                    {formatCurrency(w.fees)}
                  </TableCell>
                )}
                {visibleColumns.includes("Net Magnitude") && (
                  <TableCell className="text-center font-black text-slate-100 text-sm tabular-nums py-4 italic tracking-tighter shadow-inner">
                    {formatCurrency(w.amount - w.fees)}
                  </TableCell>
                )}
                {visibleColumns.includes("Status") && (
                  <TableCell className="text-center py-4">{getStatusBadge(w.status)}</TableCell>
                )}
                {visibleColumns.includes("Time") && (
                  <TableCell className="text-center text-slate-500 font-black text-[9px] py-4 uppercase italic">
                    {moment(w.time).format("DD MMM YYYY, HH:mm")}
                  </TableCell>
                )}
                <TableCell className="text-center py-4">
                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-600 hover:text-white hover:bg-slate-800 transition-all shadow-lg">
                      <RiPrinterLine size={16} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={allColumns.length + 1} className="py-20 text-center">
                <RiShieldCheckLine size={48} className="mx-auto text-slate-800 mb-4" />
                <p className="text-slate-500 font-black text-xs uppercase tracking-widest italic">
                  No manifests found in current sector
                </p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] italic">
          Synchronized Manifests • Sector 01
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-slate-800 h-9 font-black text-[10px] bg-slate-950 text-slate-500 hover:bg-slate-800 hover:text-white uppercase tracking-widest"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center justify-center bg-slate-950 ring-1 ring-slate-800 rounded-xl w-9 h-9 text-xs font-black text-slate-200 shadow-inner italic">
            {currentPage}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-slate-800 h-9 font-black text-[10px] bg-slate-950 text-slate-500 hover:bg-slate-800 hover:text-white uppercase tracking-widest"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
