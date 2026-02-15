"use client";

import * as React from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, AlertCircle, Printer, Wallet } from "lucide-react";
import { PaginationControl } from "@/components/ui/pagination-control";
import { DateRangeFilter } from "@/components/ui/date-range-filter";
import { Modal } from "@/components/ui/modal";
import moment from "moment";
// Define Types
interface Withdrawal {
    id: string;
    amount: number;
    bankName: string;
    accountNumber: string;
    status: 'pending' | 'success' | 'failed';
    date: Date;
    adminFee: number;
    serviceFee: number;
}

interface WithdrawalsData {
    withdrawals: Withdrawal[];
}

export default function WithdrawalsPage({
    searchParams,
}: {
    searchParams: { page?: string; limit?: string; from?: string; to?: string };
}) {
    // Mock data
    const data: WithdrawalsData = {
        withdrawals: [
            {
                id: "WD-2023001",
                amount: 100000,
                bankName: "BCA",
                accountNumber: "**** 1234",
                status: "success",
                date: new Date(Date.now() - 1000 * 60 * 60 * 2),
                adminFee: 5000,
                serviceFee: 3000 // 3%
            },
            {
                id: "WD-2023002",
                amount: 500000,
                bankName: "Mandiri",
                accountNumber: "**** 5678",
                status: "success",
                date: new Date(Date.now() - 1000 * 60 * 60 * 24),
                adminFee: 5000,
                serviceFee: 15000 // 3%
            },
            {
                id: "WD-2023003",
                amount: 200000,
                bankName: "Gopay",
                accountNumber: "0812****90",
                status: "failed",
                date: new Date(Date.now() - 1000 * 60 * 60 * 48),
                adminFee: 5000,
                serviceFee: 6000 // 3%
            },
            {
                id: "WD-2023004",
                amount: 1000000,
                bankName: "BCA",
                accountNumber: "**** 1234",
                status: "success",
                date: new Date(Date.now() - 1000 * 60 * 60 * 72),
                adminFee: 5000,
                serviceFee: 30000 // 3%
            },
            {
                id: "WD-2023006",
                amount: 750000,
                bankName: "BCA",
                accountNumber: "**** 1234",
                status: "pending",
                date: new Date(Date.now() - 1000 * 60 * 60 * 96),
                adminFee: 5000,
                serviceFee: 22500 // 3%
            },
            {
                id: "WD-2023007",
                amount: 300000,
                bankName: "OVO",
                accountNumber: "0812****90",
                status: "success",
                date: new Date(Date.now() - 1000 * 60 * 60 * 120),
                adminFee: 5000,
                serviceFee: 9000 // 3%
            }
        ]
    };

    // Filter Logic
    const from = searchParams.from;
    const to = searchParams.to;

    const filteredWithdrawals = data.withdrawals.filter(w => {
        const wDate = moment(w.date);
        if (from && wDate.isBefore(moment(from), 'day')) return false;
        if (to && wDate.isAfter(moment(to), 'day')) return false;
        return true;
    });

    // Pagination Logic
    const page = Number(searchParams.page) || 1;
    const limit = Number(searchParams.limit) || 5;
    const start = (page - 1) * limit;
    const end = start + limit;

    const paginatedWithdrawals = filteredWithdrawals.slice(start, end);
    const totalPages = Math.ceil(filteredWithdrawals.length / limit);

    // Helpers
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (date: Date) => {
        return moment(date).format('DD MMM YYYY, HH:mm');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success':
                return 'bg-green-100 text-green-700 hover:bg-green-100';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
            case 'failed':
                return 'bg-red-100 text-red-700 hover:bg-red-100';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = React.useState(false);
    const [withdrawAmount, setWithdrawAmount] = React.useState<string>("");
    const currentBalance = 2500000;

    const formatInputCurrency = (value: string) => {
        const number = value.replace(/\D/g, "");
        if (!number) return "";
        return new Intl.NumberFormat("id-ID").format(Number(number));
    };

    const parseInputCurrency = (value: string) => {
        return Number(value.replace(/\./g, "").replace(/,/g, "."));
    };

    const adminFee = 5000;
    const serviceFeePercentage = 0.03;

    const amountNum = parseInputCurrency(withdrawAmount) || 0;

    const serviceFee = amountNum * serviceFeePercentage;
    const totalDeductions = serviceFee + adminFee;

    const receivedAmount = amountNum > totalDeductions ? amountNum - totalDeductions : 0;
    const remainingBalance = currentBalance - amountNum;

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Only allow digits to be typed (and backspace obviously)
        const rawValue = value.replace(/\D/g, "");
        setWithdrawAmount(formatInputCurrency(rawValue));
    };

    const handleWithdraw = (e: React.FormEvent) => {
        e.preventDefault();

        if (amountNum < 50000) {
            alert("Minimum penarikan adalah Rp 50.000");
            return;
        }
        if (amountNum > currentBalance) {
            alert("Saldo tidak mencukupi");
            return;
        }

        // Mock withdraw logic
        setIsWithdrawModalOpen(false);
        setWithdrawAmount("");
        alert("Permintaan penarikan berhasil dikirim! (Mock)");
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900">Riwayat Penarikan</h2>
                    <p className="text-slate-500 font-medium">Lacak semua penarikan saldo Anda di sini.</p>
                </div>
                <Button variant="outline" className="gap-2 text-[var(--color-deep-purple)] border-[var(--color-deep-purple)] hover:bg-[var(--color-pastel-purple)]">
                    <Download size={16} /> Export CSV
                </Button>
            </div>

            <Card className="p-6 bg-white border-none shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <p className="text-slate-500 font-medium text-sm uppercase tracking-wider">Saldo Saat Ini</p>
                    <h1 className="text-4xl font-extrabold text-slate-900 mt-1">{formatCurrency(currentBalance)}</h1>
                </div>
                <Button
                    className="h-12 px-6 text-lg font-bold bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-[var(--color-deep-purple)] rounded-xl shadow-lg shadow-[var(--color-primary)]/20"
                    onClick={() => setIsWithdrawModalOpen(true)}
                >
                    <Wallet className="mr-2 h-5 w-5" /> Tarik Saldo
                </Button>
            </Card>

            <Card className="p-6 border-none shadow-sm flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        {/* Placeholder for future specific withdrawal filters if needed */}
                    </div>
                    <DateRangeFilter />
                </div>

                <div className="border border-slate-100 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px]">
                                <tr>
                                    <th className="px-6 py-4">ID Penarikan</th>
                                    <th className="px-6 py-4">Tanggal & Waktu</th>
                                    <th className="px-6 py-4">Metode</th>
                                    <th className="px-6 py-4">Jumlah</th>
                                    <th className="px-6 py-4">Biaya Layanan</th>
                                    <th className="px-6 py-4">Biaya Admin</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paginatedWithdrawals.length > 0 ? (
                                    paginatedWithdrawals.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-900">{item.id}</td>
                                            <td className="px-6 py-4 text-slate-600">{formatDate(item.date)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-800">{item.bankName}</span>
                                                    <span className="text-xs text-slate-500">{item.accountNumber}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(item.amount)}</td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {formatCurrency(item.serviceFee)} <span className="text-xs text-slate-400">({((item.serviceFee / item.amount) * 100).toFixed(0)}%)</span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {formatCurrency(item.adminFee)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${getStatusColor(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-slate-400 hover:text-[var(--color-deep-purple)] hover:bg-[var(--color-pastel-purple)] gap-1 h-8 px-2"
                                                    onClick={() => window.print()}
                                                >
                                                    <Printer size={14} />
                                                    <span className="text-xs">Invoice</span>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 gap-1 h-8 px-2"
                                                >
                                                    <AlertCircle size={14} />
                                                    <span className="text-xs">Lapor</span>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                                <RefreshCw className="h-8 w-8 opacity-20" />
                                                <p>Tidak ada riwayat penarikan ditemukan.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                    <PaginationControl
                        currentPage={page}
                        totalPages={totalPages}
                        limit={limit}
                        totalEntries={filteredWithdrawals.length}
                    />
                </div>
            </Card>

            <Modal
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                title="Tarik Saldo"
            >
                <form onSubmit={handleWithdraw} className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-xl mb-4">
                        <p className="text-sm text-slate-500 mb-1">Saldo Tersedia</p>
                        <p className="text-2xl font-bold text-slate-900">{formatCurrency(currentBalance)}</p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-xs text-yellow-800 mb-4">
                        Minimum Penarikan adalah IDR 50.000, maksimum jumlah per sekali penarikan adalah IDR 50.000.000
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Pilih Akun Tujuan</label>
                        <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option value="bca">BCA - **** 1234 (GamingWarrior Official)</option>
                            <option value="gopay">Gopay - 0812****90 (GamingWarrior)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Jumlah Penarikan (Rp)</label>
                        <input
                            type="text"
                            placeholder="Min. Rp 50.000"
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={withdrawAmount}
                            onChange={handleAmountChange}
                            required
                        />
                        {amountNum > 0 && (
                            <div className="space-y-2 mt-2 p-3 bg-slate-50 rounded-lg text-sm">
                                <div className="flex justify-between text-slate-500">
                                    <span>Biaya Layanan (3%)</span>
                                    <span>- {formatCurrency(serviceFee)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Biaya Admin</span>
                                    <span>- {formatCurrency(adminFee)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200">
                                    <span>Akan Diterima</span>
                                    <span>{formatCurrency(receivedAmount)}</span>
                                </div>
                                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                                    <span>Sisa Saldo</span>
                                    <span>{formatCurrency(remainingBalance)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setIsWithdrawModalOpen(false)}>
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-[var(--color-deep-purple)] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={amountNum <= 0 || remainingBalance <= 0}
                        >
                            Konfirmasi
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
