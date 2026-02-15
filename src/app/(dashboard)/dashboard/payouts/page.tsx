"use client";

import * as React from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building2, CreditCard, MoreVertical, Trash2, Pencil } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/ui/modal";

interface PayoutAccount {
    id: string;
    type: 'bank' | 'ewallet';
    providerName: string; // BCA, Mandiri, Gopay, OVO, etc.
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
        }
    ];

    const handleDelete = (id: string) => {
        // Mock delete logic
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

    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [accountType, setAccountType] = React.useState<"bank" | "ewallet">("bank");

    const bankOptions = ["BCA", "Mandiri", "BNI", "BRI", "CIMB Niaga", "Jago", "SeaBank"];
    const ewalletOptions = ["Gopay", "OVO", "Dana", "ShopeePay", "LinkAja"];

    const handleSaveAccount = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock save logic
        setIsAddModalOpen(false);
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
                    className="rounded-xl shadow-lg shadow-[var(--color-primary)]/20"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Account
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accounts.map((account) => (
                    <Card key={account.id} className="p-6 border-none shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                        {account.isPrimary && (
                            <div className="absolute top-0 right-0 bg-[var(--color-pastel-green)] text-green-700 text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                                PRIMARY
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className={`p-3 rounded-2xl ${account.type === 'bank' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                    {account.type === 'bank' ? <Building2 size={24} /> : <CreditCard size={24} />}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                            <MoreVertical size={16} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEdit(account.id)}>
                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                        </DropdownMenuItem>
                                        {!account.isPrimary && (
                                            <>
                                                <DropdownMenuItem onClick={() => handleSetPrimary(account.id)}>
                                                    Set as Primary
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDelete(account.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div>
                                <h3 className="font-bold text-lg text-slate-900">{account.providerName}</h3>
                                <p className="text-slate-500 font-mono tracking-wider mt-1">{account.accountNumber}</p>
                                <p className="text-sm text-slate-400 font-medium mt-2">{account.accountHolder}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add Payout Account"
            >
                <form onSubmit={handleSaveAccount} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Account Type</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={accountType}
                            onChange={(e) => setAccountType(e.target.value as "bank" | "ewallet")}
                        >
                            <option value="bank">Bank Account</option>
                            <option value="ewallet">E-Wallet</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Provider Name</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        >
                            <option value="" disabled selected>Select Provider</option>
                            {accountType === "bank" ? (
                                bankOptions.map(bank => (
                                    <option key={bank} value={bank}>{bank}</option>
                                ))
                            ) : (
                                ewalletOptions.map(ewallet => (
                                    <option key={ewallet} value={ewallet}>{ewallet}</option>
                                ))
                            )}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Account Number</label>
                        <input
                            type="text"
                            placeholder="e.g. 1234567890"
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Account Holder Name</label>
                        <input
                            type="text"
                            placeholder="e.g. John Doe"
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAddModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-[var(--color-deep-purple)] font-bold">
                            Save Account
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
