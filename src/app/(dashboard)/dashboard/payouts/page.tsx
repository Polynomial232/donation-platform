"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building2, CreditCard, MoreVertical, Trash2, Pencil, Save } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/ui/modal";

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
  // Mock Data
  const accounts: PayoutAccount[] = [
    {
      id: "1",
      type: "bank",
      providerName: "BCA",
      accountNumber: "1234567890",
      accountHolder: "GamingWarrior Official",
      isPrimary: true,
    },
    {
      id: "2",
      type: "ewallet",
      providerName: "Gopay",
      accountNumber: "081234567890",
      accountHolder: "GamingWarrior",
      isPrimary: false,
    },
    {
      id: "3",
      type: "bank",
      providerName: "Mandiri",
      accountNumber: "0987654321",
      accountHolder: "GamingWarrior Corp",
      isPrimary: false,
    },
  ];

  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

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
    console.log("Delete account", id);
    alert(`Delete account ${id}`);
  };

  const handleEdit = (id: string) => {
    console.log("Edit account", id);
    alert(`Edit account ${id}`);
  };

  const handleSetPrimary = (id: string) => {
    console.log("Set primary", id);
    alert(`Set ${id} as primary`);
  };

  const onSaveAccount = (data: PayoutAccountFormValues) => {
    console.log("Saving account:", data);
    setIsAddModalOpen(false);
    reset();
    alert("Account added successfully! (Mock)");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Payout Accounts</h2>
          <p className="text-slate-500 font-medium">Manage your withdrawal destinations.</p>
        </div>
        <Button
          className="rounded-xl shadow-lg shadow-[var(--color-primary)]/20 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-[var(--color-deep-purple)] font-bold h-11"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="mr-2 h-5 w-5" /> Add Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <Card
            key={account.id}
            className="p-6 border-none shadow-sm hover:shadow-md transition-all relative overflow-hidden group bg-white"
          >
            {account.isPrimary && (
              <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1.5 rounded-bl-xl uppercase tracking-wider">
                PRIMARY
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div
                  className={`p-3 rounded-2xl ${account.type === "bank" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}
                >
                  {account.type === "bank" ? <Building2 size={24} /> : <CreditCard size={24} />}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-full"
                    >
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem
                      onClick={() => handleEdit(account.id)}
                      className="cursor-pointer"
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    {!account.isPrimary && (
                      <>
                        <DropdownMenuItem
                          onClick={() => handleSetPrimary(account.id)}
                          className="cursor-pointer font-medium text-[var(--color-primary)]"
                        >
                          Set as Primary
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 cursor-pointer"
                          onClick={() => handleDelete(account.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-slate-900">{account.providerName}</h3>
                <p className="text-slate-500 font-mono tracking-wider mt-1 text-sm">
                  {account.accountNumber}
                </p>
                <p className="text-sm text-slate-400 font-bold mt-2 uppercase tracking-tight">
                  {account.accountHolder}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          reset();
        }}
        title="Add Payout Account"
      >
        <form onSubmit={handleSubmit(onSaveAccount)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Account Type</label>
            <select
              {...register("type")}
              className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            >
              <option value="bank">Bank Account</option>
              <option value="ewallet">E-Wallet</option>
            </select>
            {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Provider Name</label>
            <select
              {...register("providerName")}
              className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            >
              <option value="" disabled>
                Select Provider
              </option>
              {accountType === "bank"
                ? bankOptions.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))
                : ewalletOptions.map((ewallet) => (
                    <option key={ewallet} value={ewallet}>
                      {ewallet}
                    </option>
                  ))}
            </select>
            {errors.providerName && (
              <p className="text-xs text-red-500">{errors.providerName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Account Number</label>
            <input
              type="text"
              placeholder="e.g. 1234567890"
              {...register("accountNumber")}
              className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            />
            {errors.accountNumber && (
              <p className="text-xs text-red-500">{errors.accountNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Account Holder Name</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              {...register("accountHolder")}
              className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            />
            {errors.accountHolder && (
              <p className="text-xs text-red-500">{errors.accountHolder.message}</p>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 font-bold h-11 rounded-xl"
              onClick={() => {
                setIsAddModalOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-[var(--color-deep-purple)] font-extrabold h-11 rounded-xl shadow-lg shadow-yellow-100"
            >
              <Save size={18} className="mr-2" /> Save Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
