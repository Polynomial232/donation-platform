import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, Users } from "lucide-react";
import { PaginationControl } from "@/components/ui/pagination-control";
import { DateRangeFilter } from "@/components/ui/date-range-filter";
import moment from "moment";

// Define Types
interface Transaction {
  id: number;
  name: string;
  amount: number;
  message: string;
  type: "income" | "expense";
  time: Date;
}

interface DashboardData {
  balance: number;
  todaysRevenue: number;
  activeSupporters: number;
  transactions: Transaction[];
}

export default function DashboardPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string; from?: string; to?: string };
}) {
  // Mock data - in a real app this would come from an API
  const data: DashboardData = {
    balance: 2540000,
    todaysRevenue: 150000,
    activeSupporters: 12,
    transactions: [
      {
        id: 1,
        name: "Budi01",
        amount: 20000,
        message: "Bang sapa gw dong...",
        type: "income",
        time: new Date(Date.now() - 1000 * 60 * 10), // 10m ago
      },
      {
        id: 2,
        name: "Withdrawal",
        amount: -500000,
        message: "To Bank BCA",
        type: "expense",
        time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2h ago
      },
      {
        id: 3,
        name: "Siti_Gamer",
        amount: 50000,
        message: "Semangat bang contentnya!",
        type: "income",
        time: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5h ago
      },
      {
        id: 4,
        name: "Server Cost",
        amount: -150000,
        message: "Monthly payment",
        type: "expense",
        time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1d ago
      },
      {
        id: 5,
        name: "Donatur_Misterius",
        amount: 100000,
        message: "Semoga berkah bang",
        type: "income",
        time: new Date(Date.now() - 1000 * 60 * 60 * 206), // 1d 2h ago
      },
      {
        id: 6,
        name: "Fans_Berat",
        amount: 10000,
        message: "Keep it up!",
        type: "income",
        time: new Date(Date.now() - 1000 * 60 * 60 * 480), // 2d ago
      },
    ],
  };

  // Filter Logic
  const from = searchParams.from;
  const to = searchParams.to;

  const filteredTransactions = data.transactions.filter((t) => {
    const tDate = moment(t.time);
    if (from && tDate.isBefore(moment(from), "day")) return false;
    if (to && tDate.isAfter(moment(to), "day")) return false;
    return true;
  });

  // Pagination Logic
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 5;
  const start = (page - 1) * limit;
  const end = start + limit;

  // Use filtered transactions for pagination
  const paginatedTransactions = filteredTransactions.slice(start, end);
  const totalPages = Math.ceil(filteredTransactions.length / limit);

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  // Helper to format time relative
  const formatTime = (date: Date) => {
    const activityDate = moment(date);
    const now = moment();
    const diffDays = now.diff(activityDate, "days");

    if (diffDays >= 7) {
      return activityDate.format("DD MMM YYYY");
    }

    return (
      activityDate
        .fromNow(true)
        .replace("seconds", "s")
        .replace("second", "s")
        .replace("minutes", "m")
        .replace("minute", "m")
        .replace("hours", "h")
        .replace("hour", "h")
        .replace("days", "d")
        .replace("day", "d") + " ago"
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Dashboard</h2>
          <p className="text-slate-500 font-medium">Welcome back, GamingWarrior!</p>
        </div>
        <Button className="rounded-full" disabled={data.balance === 0}>
          <Wallet className="mr-2 h-4 w-4" /> Withdraw
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-none shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Balance</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {formatCurrency(data.balance)}
              </h3>
            </div>
            <div className="p-2 bg-[var(--color-pastel-yellow)] rounded-xl text-[var(--color-deep-purple)]">
              <Wallet size={20} />
            </div>
          </div>
        </Card>
        <Card className="p-6 border-none shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Today's Revenue
              </p>
              <h3 className="text-2xl font-black text-green-600 mt-1">
                {formatCurrency(data.todaysRevenue)}
              </h3>
            </div>
            <div className="p-2 bg-green-100 rounded-xl text-green-700">
              <TrendingUp size={20} />
            </div>
          </div>
        </Card>
        <Card className="p-6 border-none shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Active Supporters
              </p>
              <h3 className="text-2xl font-black text-blue-600 mt-1">{data.activeSupporters}</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-xl text-blue-700">
              <Users size={20} />
            </div>
          </div>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">History Pemasukan & Pengeluaran</h3>
          <DateRangeFilter />
        </div>
        <Card className="border-none shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px]">
                <tr>
                  <th className="px-6 py-4 rounded-tl-2xl">Type</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4 rounded-tr-2xl">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.type === "income"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.type === "income" ? "Income" : "Expense"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">{transaction.name}</td>
                      <td
                        className={`px-6 py-4 font-bold ${
                          transaction.type === "income"
                            ? "text-[var(--color-deep-purple)]" // Or green if prefered
                            : "text-red-500"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}{" "}
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{transaction.message}</td>
                      <td className="px-6 py-4 text-slate-400 font-medium">
                        {formatTime(transaction.time)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 italic">
                      No transactions found for the selected period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-100">
            <PaginationControl
              currentPage={page}
              totalPages={totalPages}
              limit={limit}
              totalEntries={filteredTransactions.length}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
