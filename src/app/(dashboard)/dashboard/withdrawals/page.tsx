"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RiWallet3Line,
  RiHistoryLine,
  RiCheckDoubleLine,
  RiTimeLine,
  RiAddLine,
  RiLineChartLine,
} from "@remixicon/react";
import { Modal } from "@/components/ui/modal";
import WithdrawalsTable from "@/components/dashboard/WithdrawalsTable";

const withdrawalSchema = z.object({
  bankAccountId: z.string().min(1, "Select destination account"),
  amount: z.number().min(50000, "Minimum IDR 50.000 required"),
});

type WithdrawalFormValues = z.infer<typeof withdrawalSchema>;

export default function WithdrawalsPage() {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = React.useState(false);

  const currentBalance = 2500000;
  const adminFee = 5000;
  const serviceFeePercentage = 0.03;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      bankAccountId: "bca",
      amount: 0,
    },
  });

  const amountNum = watch("amount") || 0;
  const serviceFee = amountNum * serviceFeePercentage;
  const totalDeductions = serviceFee + adminFee;
  const receivedAmount = amountNum > totalDeductions ? amountNum - totalDeductions : 0;
  const remainingBalance = currentBalance - amountNum;

  // Optimized Withdrawal Manifest Mapping
  const withdrawalsData: any[] = [
    {
      id: "WD-XY892",
      name: "Bank Central Asia",
      accountNumber: "**** 9010",
      amount: 1000000,
      fees: 35000,
      status: "success",
      time: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: "WD-ZQ441",
      name: "Bank Mandiri",
      accountNumber: "**** 2100",
      amount: 500000,
      fees: 20000,
      status: "pending",
      time: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      id: "WD-AB112",
      name: "GOPAY WALLET",
      accountNumber: "0812****7890",
      amount: 250000,
      fees: 12500,
      status: "failed",
      time: new Date(Date.now() - 1000 * 60 * 60 * 48),
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleWithdraw = (data: WithdrawalFormValues) => {
    if (data.amount > currentBalance) return;
    setIsWithdrawModalOpen(false);
    reset();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4 md:px-0">
        <div>
          <h2 className="text-2xl font-medium text-slate-100 italic tracking-tight uppercase">
            WITHDRAWAL MANAGEMENT
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Manage your balance withdrawals and transaction history.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="rounded-xl bg-yellow-400 text-slate-950 hover:bg-yellow-500 h-10 px-4 font-bold text-xs"
            onClick={() => setIsWithdrawModalOpen(true)}
          >
            <RiAddLine size={18} className="mr-2" /> NEW WITHDRAWAL
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-4 md:mx-0">
        <Card className="shadow-2xl border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
              Available Balance
            </CardTitle>
            <RiWallet3Line className="h-4 w-4 text-slate-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-100 leading-none">
              {formatCurrency(currentBalance)}
            </div>
            <div className="flex items-center pt-2 text-[10px] text-emerald-400 font-bold uppercase tracking-tight">
              <RiCheckDoubleLine className="mr-1 h-3.5 w-3.5" />
              <span>Capital Reserve Verified</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
              Total Withdrawn
            </CardTitle>
            <RiLineChartLine className="h-4 w-4 text-slate-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-100 leading-none">
              {formatCurrency(1750000)}
            </div>
            <div className="flex items-center pt-2 text-[10px] text-blue-400 font-bold uppercase tracking-tight">
              <RiHistoryLine className="mr-1 h-3.5 w-3.5" />
              <span>Verified Disbursed</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
              Processing Rate
            </CardTitle>
            <RiTimeLine className="h-4 w-4 text-slate-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-100 leading-none">2.4h</div>
            <div className="flex items-center pt-2 text-[10px] text-yellow-400 font-bold uppercase tracking-tight">
              <span>Average Fulfillment</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Specialized Withdrawal Records */}
      <div className="mx-4 md:mx-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="size-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)] animate-pulse" />
          <h3 className="text-lg font-bold text-slate-100 uppercase tracking-tight italic">
            Synchronization Manifests
          </h3>
        </div>
        <WithdrawalsTable withdrawals={withdrawalsData} />
      </div>

      <Modal
        isOpen={isWithdrawModalOpen}
        onClose={() => {
          setIsWithdrawModalOpen(false);
          reset();
        }}
        title="Fulfillment Protocol"
      >
        <form onSubmit={handleSubmit(handleWithdraw)} className="space-y-6 pt-2">
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-1 ring-1 ring-inset ring-white/5 shadow-inner">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
              RESERVE BALANCE
            </span>
            <div className="text-3xl font-black text-slate-100 italic tracking-tighter tabular-nums">
              {formatCurrency(currentBalance)}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Capital Destination
            </label>
            <select
              {...register("bankAccountId")}
              className="flex h-14 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all uppercase"
            >
              <option value="bca">BCA • •••• 9010 (Verified)</option>
              <option value="gopay">GOPAY • 0812****7890 (Primary)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Transfer magnitude (IDR)
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-600 transition-colors group-focus-within:text-yellow-400">
                IDR
              </span>
              <input
                type="text"
                placeholder="0"
                className="flex h-14 w-full rounded-2xl border border-slate-800 bg-slate-950 pl-12 pr-4 py-2 text-xl font-black text-slate-100 placeholder:text-slate-800 focus:outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/10 transition-all tabular-nums selection:bg-yellow-400/30"
                value={amountNum === 0 ? "" : amountNum.toLocaleString("id-ID")}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setValue("amount", Number(value) || 0, { shouldValidate: true });
                }}
              />
            </div>
            {errors.amount && (
              <p className="text-[10px] font-black text-red-500 italic mt-1 ml-1 leading-none tracking-tight">
                ERROR: {errors.amount.message}
              </p>
            )}
          </div>

          {amountNum > 0 && (
            <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl space-y-3 ring-1 ring-inset ring-white/5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none">
                <span>Protocol Fee Estimate</span>
                <span className="text-slate-400">-{formatCurrency(serviceFee)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none">
                <span>Administrative Overhead</span>
                <span className="text-slate-400">-{formatCurrency(adminFee)}</span>
              </div>
              <div className="h-px bg-slate-800/80 my-2 shadow-[0_0_10px_rgba(255,255,255,0.05)]" />
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">
                  Net Capital Settlement
                </span>
                <span className="text-2xl font-black text-yellow-400 italic tracking-tighter drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                  {formatCurrency(receivedAmount)}
                </span>
              </div>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 font-black h-14 rounded-2xl border-slate-800 text-slate-600 hover:bg-slate-800 hover:text-white transition-all uppercase text-[10px] tracking-[0.2em] shadow-lg"
              onClick={() => {
                setIsWithdrawModalOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black h-14 rounded-2xl transition-all uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-yellow-900/20 active:scale-[0.98]"
              disabled={amountNum < 50000 || remainingBalance < 0}
            >
              Confirm Transfer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
