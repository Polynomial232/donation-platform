"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter, Search } from "lucide-react";

const transactions = [
    { id: "TRX-001", user: "Budi01", amount: 20000, message: "Bang sapa gw dong...", date: "14 Feb 2024, 14:30", status: "Success" },
    { id: "TRX-002", user: "Siti_G", amount: 50000, message: "Request lagu galau", date: "14 Feb 2024, 13:15", status: "Success" },
    { id: "TRX-003", user: "Anon", amount: 10000, message: "-", date: "14 Feb 2024, 12:00", status: "Success" },
    { id: "TRX-004", user: "Joko", amount: 100000, message: "Semangat bang!", date: "13 Feb 2024, 20:00", status: "Success" },
    { id: "TRX-005", user: "Gamer123", amount: 5000, message: "GGWP", date: "13 Feb 2024, 19:45", status: "Failed" },
];

export default function HistoryPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900">Transaction History</h2>
                    <p className="text-slate-500 font-medium">View and manage your donation history.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl">
                        <Download size={16} className="mr-2" /> Export CSV
                    </Button>
                </div>
            </div>

            <Card className="p-4 border-none shadow-sm space-y-4">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search donor name or message..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[var(--color-pastel-purple)]"
                        />
                    </div>
                    <Button variant="outline" className="rounded-xl px-3">
                        <Filter size={18} />
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px]">
                            <tr>
                                <th className="px-4 py-3 rounded-tl-xl">ID</th>
                                <th className="px-4 py-3">User</th>
                                <th className="px-4 py-3">Message</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3 rounded-tr-xl">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {transactions.map((trx) => (
                                <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-3 font-mono text-slate-400 text-xs">{trx.id}</td>
                                    <td className="px-4 py-3 font-bold text-slate-900">{trx.user}</td>
                                    <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate">{trx.message}</td>
                                    <td className="px-4 py-3 font-bold text-[var(--color-deep-purple)]">Rp {trx.amount.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-slate-400 text-xs">{trx.date}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${trx.status === "Success"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}>
                                            {trx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
