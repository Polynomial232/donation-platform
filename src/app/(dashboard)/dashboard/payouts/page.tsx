"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  RiBankLine,
  RiWallet3Line,
  RiAddLine,
  RiMore2Fill,
  RiDeleteBin6Line,
  RiEditLine,
  RiSaveLine,
  RiStarFill,
  RiCheckboxCircleFill,
  RiInformationLine,
} from "@remixicon/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DestinationCard } from "@/components/ui/destination-card";

const payoutAccountSchema = z.object({
  type: z.enum(["bank", "ewallet"]),
  providerName: z.string().min(1, "Provider is required"),
  accountNumber: z.string().min(5, "Account number too short"),
  accountHolder: z.string().min(3, "Name is required"),
});

type PayoutAccountFormValues = z.infer<typeof payoutAccountSchema>;

interface PayoutAccount {
  id: string;
  type: "bank" | "ewallet";
  providerName: string;
  accountNumber: string;
  accountHolder: string;
  isPrimary: boolean;
}

export default function PayoutsPage() {
  // Reactive State for Accounts
  const [accounts, setAccounts] = React.useState<PayoutAccount[]>([
    {
      id: "1",
      type: "bank",
      providerName: "BANK CENTRAL ASIA",
      accountNumber: "1234 5678 9010",
      accountHolder: "DAFFA ARYANTA",
      isPrimary: true,
    },
    {
      id: "2",
      type: "ewallet",
      providerName: "GOPAY DIGITAL",
      accountNumber: "0812 3456 7890",
      accountHolder: "DAFFA ARYANTA",
      isPrimary: false,
    },
    {
      id: "3",
      type: "bank",
      providerName: "BANK MANDIRI",
      accountNumber: "0987 6543 2100",
      accountHolder: "DAFFA ARYANTA CORP",
      isPrimary: false,
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  // Masking Helper
  const maskAccountNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, "");
    if (cleaned.length <= 4) return cleaned;
    const firstTwo = cleaned.slice(0, 2);
    const lastTwo = cleaned.slice(-2);
    const middle = "•".repeat(Math.max(4, cleaned.length - 4));
    return `${firstTwo}${middle}${lastTwo}`;
  };

  // Helper for Theme Colors and Images
  const getAccountTheme = (provider: string) => {
    switch (true) {
      case provider.includes("CENTRAL ASIA"):
        return {
          color: "220 70% 15%",
          img: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=1887",
        };
      case provider.includes("GOPAY"):
        return {
          color: "140 60% 10%",
          img: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1887",
        };
      case provider.includes("MANDIRI"):
        return {
          color: "200 60% 12%",
          img: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=1887",
        };
      default:
        return {
          color: "250 50% 12%",
          img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1887",
        };
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PayoutAccountFormValues>({
    resolver: zodResolver(payoutAccountSchema),
    defaultValues: {
      type: "bank",
      providerName: "",
      accountNumber: "",
      accountHolder: "",
    },
  });

  const accountType = watch("type");

  const bankOptions = ["BCA", "Mandiri", "BNI", "BRI", "CIMB Niaga", "Jago", "SeaBank"];
  const ewalletOptions = ["Gopay", "OVO", "Dana", "ShopeePay", "LinkAja"];

  const handleDelete = (id: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  const handleEdit = (id: string) => {
    console.log("Edit account", id);
    // Future: implement edit functionality
  };

  const handleSetPrimary = (id: string) => {
    setAccounts((prev) =>
      prev.map((acc) => ({
        ...acc,
        isPrimary: acc.id === id,
      }))
    );
  };

  const onSaveAccount = (data: PayoutAccountFormValues) => {
    const newAccount: PayoutAccount = {
      id: Math.random().toString(36).substr(2, 9),
      isPrimary: accounts.length === 0,
      ...data,
    };
    setAccounts((prev) => [...prev, newAccount]);
    setIsAddModalOpen(false);
    reset();
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4 md:px-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-400/10 rounded-2xl border border-yellow-400/20">
            <RiBankLine className="text-yellow-400" size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-100 italic tracking-tight uppercase">
              Payout Map
            </h2>
            <p className="text-slate-500 text-sm font-medium italic leading-none mt-1">
              Geographic Visualizer of Disbursement Points
            </p>
          </div>
        </div>
        <Button
          className="rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.15)] bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black h-11 px-6 transition-all"
          onClick={() => setIsAddModalOpen(true)}
        >
          <RiAddLine className="mr-2 h-5 w-5 stroke-3" /> PROVISION NEW POINT
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mx-4 md:mx-0">
        {accounts.map((account) => {
          const theme = getAccountTheme(account.providerName);
          return (
            <div key={account.id} className="group relative w-full h-[320px]">
              <DestinationCard
                imageUrl={theme.img}
                location={account.providerName}
                flag={account.type === "bank" ? "🏦" : "📱"}
                stats={maskAccountNumber(account.accountNumber)}
                subtitle={`Holder: ${account.accountHolder}`}
                themeColor={theme.color}
                className="h-full"
                onClick={() => !account.isPrimary && handleSetPrimary(account.id)}
              />

              {/* Primary Waypoint Indicator */}
              {account.isPrimary && (
                <div className="absolute top-4 left-4 z-20">
                  <Badge className="bg-yellow-400 text-slate-950 font-black text-[9px] uppercase px-3 rounded-full shadow-lg">
                    PRIMARY POINT
                  </Badge>
                </div>
              )}

              {/* Admin Actions */}
              <div className="absolute top-4 right-4 z-20">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-black/40 rounded-full transition-all"
                    >
                      <RiMore2Fill size={18} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-slate-900 border-slate-800 rounded-xl shadow-2xl p-1 text-slate-300"
                  >
                    <DropdownMenuItem
                      onClick={() => handleEdit(account.id)}
                      className="cursor-pointer rounded-lg focus:bg-slate-800 focus:text-white"
                    >
                      <RiEditLine className="mr-2 h-4 w-4" /> Edit Account
                    </DropdownMenuItem>
                    {!account.isPrimary && (
                      <>
                        <DropdownMenuItem
                          onClick={() => handleSetPrimary(account.id)}
                          className="cursor-pointer rounded-lg text-yellow-500 focus:bg-yellow-500/10 focus:text-yellow-400"
                        >
                          <RiStarFill className="mr-2 h-4 w-4" /> Set as Primary
                        </DropdownMenuItem>
                        <Separator className="my-1 bg-slate-800" />
                        <DropdownMenuItem
                          className="cursor-pointer rounded-lg text-red-500 focus:bg-red-500/10 focus:text-red-400"
                          onClick={() => handleDelete(account.id)}
                        >
                          <RiDeleteBin6Line className="mr-2 h-4 w-4" /> Delete Account
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          reset();
        }}
        title="Payment Setup"
      >
        <div className="mb-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
          <div className="flex gap-3">
            <RiInformationLine className="text-blue-400 shrink-0" size={20} />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Enter your payment details accurately. Payments will be disbursed to your primary
              account by default. Process usually takes 1-3 business days.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSaveAccount)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
              Method Type
            </label>
            <select
              {...register("type")}
              className="flex h-12 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all cursor-pointer"
            >
              <option value="bank" className="bg-slate-900">
                BANK TRANSFER
              </option>
              <option value="ewallet" className="bg-slate-900">
                E-WALLET / DIGITAL CURRENCY
              </option>
            </select>
            {errors.type && (
              <p className="text-[10px] font-bold text-red-500 pl-1">⚠️ {errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
              Provider Selection
            </label>
            <select
              {...register("providerName")}
              className="flex h-12 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all cursor-pointer"
            >
              <option value="" disabled className="bg-slate-900">
                CHOOSE PROVIDER...
              </option>
              {accountType === "bank"
                ? bankOptions.map((bank) => (
                    <option key={bank} value={bank} className="bg-slate-900 uppercase">
                      {bank}
                    </option>
                  ))
                : ewalletOptions.map((ewallet) => (
                    <option key={ewallet} value={ewallet} className="bg-slate-900 uppercase">
                      {ewallet}
                    </option>
                  ))}
            </select>
            {errors.providerName && (
              <p className="text-[10px] font-bold text-red-500 pl-1">
                ⚠️ {errors.providerName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
              Account Number / ID
            </label>
            <input
              type="text"
              placeholder="e.g. 1029384756"
              {...register("accountNumber")}
              className="flex h-12 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all"
            />
            {errors.accountNumber && (
              <p className="text-[10px] font-bold text-red-500 pl-1">
                ⚠️ {errors.accountNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
              Account Holder Full Name
            </label>
            <input
              type="text"
              placeholder="UPPERCASE PREFERRED"
              {...register("accountHolder")}
              className="flex h-12 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all"
            />
            {errors.accountHolder && (
              <p className="text-[10px] font-bold text-red-500 pl-1">
                ⚠️ {errors.accountHolder.message}
              </p>
            )}
          </div>

          <div className="pt-6 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 font-black text-xs h-12 rounded-xl border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-white transition-all uppercase"
              onClick={() => {
                setIsAddModalOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black text-xs h-12 rounded-xl shadow-xl shadow-yellow-900/10 transition-all uppercase"
            >
              <RiSaveLine size={18} className="mr-2" /> Verify & Save
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
