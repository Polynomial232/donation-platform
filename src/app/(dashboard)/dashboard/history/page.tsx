"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, MessageSquare, PlayCircle, Pin, PinOff, Trophy, User } from "lucide-react";
import { PaginationControl } from "@/components/ui/pagination-control";
import { DateRangeFilter } from "@/components/ui/date-range-filter";
import moment from "moment";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    TooltipProps,
} from "recharts";

// --- Mock Data Types ---
interface DailyStat {
    date: string;
    amount: number;
}

interface SupportTransaction {
    id: string;
    supporter: string;
    email?: string;
    amount: number;
    message: string;
    date: Date;
    isAnonymous: boolean;
    media?: {
        type: 'sound' | 'video';
        url: string;
        name: string;
    };
}

export default function SupportHistoryPage({
    searchParams,
}: {
    searchParams: { page?: string; limit?: string; from?: string; to?: string };
}) {
    // --- Mock Data ---
    // Generate last 12 months for the chart
    const generateMonthlyStats = (): DailyStat[] => {
        const stats: DailyStat[] = [];
        for (let i = 11; i >= 0; i--) {
            stats.push({
                date: moment().subtract(i, 'months').format('MMM'),
                amount: Math.floor(Math.random() * 5000000) + 500000,
            });
        }
        return stats;
    };

    const monthlyStats = React.useMemo(() => generateMonthlyStats(), []);

    // Generate last 30 days for the chart
    const generateDailyStats = (): DailyStat[] => {
        const stats: DailyStat[] = [];
        for (let i = 29; i >= 0; i--) {
            stats.push({
                date: moment().subtract(i, 'days').format('DD MMM'),
                amount: Math.floor(Math.random() * 500000) + 50000,
            });
        }
        return stats;
    };

    const dailyStats = React.useMemo(() => generateDailyStats(), []);

    // Calculate Today's Support (Mocked slightly to ensure non-zero if no transactions match)
    const todaySupport = React.useMemo(() => {
        // In a real app, this would filter transactions or come from an API
        // For demo, let's use a random value + any transactions from today
        return Math.floor(Math.random() * 500000) + 150000;
    }, []);

    // Mock Transactions
    const transactions: SupportTransaction[] = [
        { id: "TX-001", supporter: "Budi Santoso", email: "budi.santoso@gmail.com", amount: 50000, message: "Semangat terus bang!", date: new Date(), isAnonymous: false, media: { type: 'sound', name: 'Jumpscare', url: '#' } },
        { id: "TX-002", supporter: "Siti Aminah", email: "siti.aminah@yahoo.com", amount: 100000, message: "Request lagu galau dong.", date: new Date(Date.now() - 3600000), isAnonymous: false },
        { id: "TX-003", supporter: "Anonim", email: "anon@hidden.com", amount: 25000, message: "", date: new Date(Date.now() - 7200000), isAnonymous: true },
        { id: "TX-004", supporter: "GamerSejati", email: "gamer.sejati@game.net", amount: 10000, message: "GGWP!", date: new Date(Date.now() - 86400000), isAnonymous: false, media: { type: 'video', name: 'Meme Lucu', url: '#' } },
        { id: "TX-005", supporter: "FansBerat", email: "fans.berat@fansclub.id", amount: 200000, message: "Top up buat beli skin baru.", date: new Date(Date.now() - 172800000), isAnonymous: false },
        { id: "TX-006", supporter: "Donatur Hati", email: "donatur.hati@charity.org", amount: 500000, message: "Berkah selalu ya.", date: new Date(Date.now() - 259200000), isAnonymous: false, media: { type: 'sound', name: 'Applause', url: '#' } },
        { id: "TX-007", supporter: "KucingOren", email: "kucing.oren@pets.com", amount: 15000, message: "Meow.", date: new Date(Date.now() - 345600000), isAnonymous: false },
        { id: "TX-008", supporter: "User123", email: "user123@platform.com", amount: 30000, message: "Semoga terbantu.", date: new Date(Date.now() - 432000000), isAnonymous: false },
    ];

    // Filter Logic
    const from = searchParams.from;
    const to = searchParams.to;

    const filteredTransactions = transactions.filter(t => {
        const tDate = moment(t.date);
        if (from && tDate.isBefore(moment(from), 'day')) return false;
        if (to && tDate.isAfter(moment(to), 'day')) return false;
        return true;
    });

    // Pagination Logic
    const page = Number(searchParams.page) || 1;
    const limit = Number(searchParams.limit) || 5;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedTransactions = filteredTransactions.slice(start, end);
    const totalPages = Math.ceil(filteredTransactions.length / limit);

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

    // Custom Tooltip for Chart
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl">
                    <p className="text-xs font-bold text-slate-500 mb-1">{label}</p>
                    <p className="text-sm font-extrabold text-[var(--color-primary)]">
                        {formatCurrency(payload[0].value as number)}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Top Supporters Logic
    const topSupporters = React.useMemo(() => {
        // 1. Filter transactions from last 1 month
        const oneMonthAgo = moment().subtract(1, 'month');
        const recentTransactions = transactions.filter(t =>
            moment(t.date).isAfter(oneMonthAgo) && !t.isAnonymous
        );

        // 2. Group by supporter and sum amounts
        const supporterMap = new Map<string, { name: string; email?: string; totalAmount: number; count: number }>();

        recentTransactions.forEach(t => {
            const key = t.email || t.supporter; // Use email as key if available, else name
            if (!supporterMap.has(key)) {
                supporterMap.set(key, {
                    name: t.supporter,
                    email: t.email,
                    totalAmount: 0,
                    count: 0
                });
            }
            const current = supporterMap.get(key)!;
            current.totalAmount += t.amount;
            current.count += 1;
        });

        // 3. Convert to array, sort by total amount desc, take top 15
        return Array.from(supporterMap.values())
            .sort((a, b) => b.totalAmount - a.totalAmount)
            .slice(0, 15);
    }, [transactions]);

    // Pinned Transactions Logic
    const [pinnedIds, setPinnedIds] = React.useState<string[]>([]);

    const togglePin = (id: string) => {
        if (pinnedIds.includes(id)) {
            setPinnedIds(prev => prev.filter(pId => pId !== id));
        } else {
            if (pinnedIds.length >= 3) {
                alert("Maksimal 3 donasi yang dapat di-pin.");
                return;
            }
            setPinnedIds(prev => [...prev, id]);
        }
    };

    const pinnedTransactions = transactions.filter(t => pinnedIds.includes(t.id));

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900">Riwayat Dukungan</h2>
                    <p className="text-slate-500 font-medium">Pantau terus dukungan yang masuk dari para penggemarmu.</p>
                </div>
                <div className="flex gap-2">
                    <DateRangeFilter />
                    <Button variant="outline" className="gap-2 text-[var(--color-deep-purple)] border-[var(--color-deep-purple)] hover:bg-[var(--color-pastel-purple)]">
                        <Download size={16} /> Export CSV
                    </Button>
                </div>
            </div>

            {/* Graphs Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Today's Support Summary */}
                <Card className="col-span-1 p-6 border-none shadow-sm flex flex-col justify-center items-center text-center bg-gradient-to-br from-purple-50 to-white">
                    <div className="p-3 bg-purple-100 rounded-full mb-4 text-[var(--color-primary)]">
                        <MessageSquare size={24} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">Dukungan Hari Ini</h3>
                    <p className="text-3xl font-extrabold text-[var(--color-deep-purple)]">
                        {formatCurrency(todaySupport)}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">Update terakhir: {moment().format('HH:mm')}</p>
                </Card>

                {/* Monthly Graph */}
                <Card className="col-span-1 lg:col-span-3 p-6 border-none shadow-sm">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Trend Dukungan Bulanan</h3>
                        <p className="text-sm text-slate-500">Statistik pendapatan dalam 12 bulan terakhir.</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    tickFormatter={(value) => `Rp ${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />
                                <Line
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#7c3aed"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: "#7c3aed", strokeWidth: 2, stroke: "#fff" }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Daily Graph */}
                <Card className="col-span-1 lg:col-span-4 p-6 border-none shadow-sm">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Trend Dukungan Harian</h3>
                        <p className="text-sm text-slate-500">Statistik pendapatan dalam 30 hari terakhir.</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dailyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    tickFormatter={(value) => `Rp ${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />
                                <Line
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#7c3aed"
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>


            {/* Pinned Transactions Section */}
            {pinnedTransactions.length > 0 && (
                <Card className="p-6 border-none shadow-sm flex flex-col gap-4 bg-yellow-50/50">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Pin className="text-[var(--color-primary)] fill-[var(--color-primary)]" size={20} />
                            <h3 className="text-lg font-bold text-slate-900">Donasi Tersemat ({pinnedTransactions.length}/3)</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {pinnedTransactions.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2 relative group">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute top-2 right-2 h-6 w-6 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50"
                                    onClick={() => togglePin(item.id)}
                                >
                                    <PinOff size={14} />
                                </Button>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-900">{item.isAnonymous ? "Anonim" : item.supporter}</span>
                                </div>
                                <p className="text-2xl font-extrabold text-[var(--color-deep-purple)]">{formatCurrency(item.amount)}</p>
                                {item.message && (
                                    <p className="text-sm text-slate-600 italic line-clamp-2">"{item.message}"</p>
                                )}
                                <div className="text-xs text-slate-400 font-mono mt-auto pt-2 flex justify-between">
                                    <span>{item.id}</span>
                                    <span>{moment(item.date).fromNow()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Transaction List */}
            <Card className="p-6 border-none shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Daftar Dukungan Masuk</h3>
                </div>

                <div className="border border-slate-100 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px]">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Tanggal</th>
                                    <th className="px-6 py-4">Pendukung</th>
                                    <th className="px-6 py-4">Pesan</th>
                                    <th className="px-6 py-4">Jumlah</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paginatedTransactions.length > 0 ? (
                                    paginatedTransactions.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 text-xs font-mono text-slate-500">
                                                {item.id}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                                                {formatDate(item.date)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900">
                                                        {item.isAnonymous ? "Anonim" : item.supporter}
                                                    </span>
                                                    {!item.isAnonymous && item.email && (
                                                        <span className="text-xs text-slate-500">{item.email}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    {item.message ? (
                                                        <span className="text-slate-600 italic">"{item.message}"</span>
                                                    ) : (
                                                        <span className="text-slate-400 text-xs">- Tidak ada pesan -</span>
                                                    )}
                                                    {item.media && (
                                                        <div className="flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-1 rounded w-fit">
                                                            {item.media.type === 'sound' ? '🎵' : '📺'} {item.media.name}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-[var(--color-deep-purple)]">
                                                {formatCurrency(item.amount)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className={`h-8 w-8 p-0 rounded-full ${pinnedIds.includes(item.id) ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10' : 'text-slate-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10'}`}
                                                        onClick={() => togglePin(item.id)}
                                                        title={pinnedIds.includes(item.id) ? "Lepas Pin" : "Pin Donasi"}
                                                    >
                                                        {pinnedIds.includes(item.id) ? <PinOff size={16} /> : <Pin size={16} />}
                                                    </Button>
                                                    {item.media && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-green-600 hover:bg-green-50"
                                                            onClick={() => alert(`Memainkan media: ${item.media?.name}`)}
                                                            title="Mainkan Lagi"
                                                        >
                                                            <PlayCircle size={16} />
                                                        </Button>
                                                    )}
                                                    {item.message && !item.isAnonymous && (
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10">
                                                            <MessageSquare size={16} />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                                <RefreshCw className="h-8 w-8 opacity-20" />
                                                <p>Belum ada dukungan yang masuk.</p>
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
                        totalEntries={filteredTransactions.length}
                    />
                </div>
            </Card>
            {/* Top 15 Supporters Section */}
            <Card className="p-6 border-none shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Trophy className="text-yellow-500 fill-yellow-500" size={20} />
                        <h3 className="text-lg font-bold text-slate-900">Top 15 Pendukung</h3>
                    </div>
                    <p className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-md">1 Bulan Terakhir</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {topSupporters.length > 0 ? (
                        topSupporters.map((supporter, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                    index === 1 ? 'bg-slate-200 text-slate-600' :
                                        index === 2 ? 'bg-orange-100 text-orange-600' :
                                            'bg-slate-50 text-slate-400'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate">{supporter.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{supporter.email || 'No Email'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-extrabold text-[var(--color-primary)]">{formatCurrency(supporter.totalAmount)}</p>
                                    <p className="text-[10px] text-slate-400">{supporter.count} donasi</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                            <User className="h-12 w-12 opacity-20" />
                            <p>Belum ada data pendukung dalam 30 hari terakhir.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
