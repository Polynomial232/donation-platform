import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, Users, ArrowUpRight } from "lucide-react";
import { DateRangeFilter } from "@/components/ui/date-range-filter";
import TransactionsTable from "@/components/dashboard/TransactionsTable";

// Define Types
interface Transaction {
  id: number;
  name: string;
  email?: string;
  amount: number;
  message: string;
  type: "income" | "expense";
  tags?: string[];
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
  searchParams: { from?: string; to?: string };
}) {
  // Generate 30 dummy data items
  const generateDummyTransactions = (): Transaction[] => {
    const names = [
      "Budi01",
      "Siti_Gamer",
      "Donatur_Misterius",
      "Fans_Berat",
      "Andi_Pro",
      "Rina_Stream",
      "Eko_Gaming",
      "Dewi_YT",
      "Fajar_Twitch",
      "Lia_Support",
    ];
    const messages = [
      "Semangat bang!",
      "Great content!",
      "Keep it up!",
      "Sapa gw dong",
      "Minimal sapa",
      "Donasi buat kopi",
      "Mantap!",
      "Nice job!",
      "Legend!",
      "GGWP",
    ];

    const data: Transaction[] = [];
    for (let i = 1; i <= 100; i++) {
      const isIncome = Math.random() > 0.3;
      const senderName = isIncome
        ? names[Math.floor(Math.random() * names.length)]
        : Math.random() > 0.5
          ? "Withdrawal"
          : "Server Cost";

      // Random tags for income
      const possibleTags = ["Media Share", "Soundboard", "TTS", "GIFT", "REACTION"];
      const transactionTags = isIncome
        ? Math.random() > 0.5
          ? [
              possibleTags[Math.floor(Math.random() * possibleTags.length)],
              possibleTags[Math.floor(Math.random() * possibleTags.length)],
            ].filter((v, i, a) => a.indexOf(v) === i)
          : []
        : [];

      data.push({
        id: i,
        name: senderName,
        email: isIncome ? `${senderName.toLowerCase()}@example.com` : "finance@rukun.io",
        amount: isIncome
          ? Math.floor(Math.random() * 500000) + 10000
          : -(Math.floor(Math.random() * 500000) + 50000),
        message: isIncome
          ? messages[Math.floor(Math.random() * messages.length)]
          : Math.random() > 0.5
            ? "To Bank BCA"
            : "Infrastructure Fee",
        type: isIncome ? "income" : "expense",
        tags: transactionTags,
        time: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i * 2)), // staggered time across 60 days
      });
    }
    return data;
  };

  const today = new Date();
  const defaultFrom = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const defaultTo = new Date(today.getFullYear(), today.getMonth(), 0);

  const fromDate = searchParams.from ? new Date(searchParams.from) : defaultFrom;
  const toDate = searchParams.to ? new Date(searchParams.to) : defaultTo;

  const data: DashboardData = {
    balance: 2540000,
    todaysRevenue: 150000,
    activeSupporters: 12,
    transactions: generateDummyTransactions().filter((t) => {
      return t.time >= fromDate && t.time <= toDate;
    }),
  };

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center px-4 md:px-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 italic">Account Overview</h2>
          <p className="text-slate-500 text-sm">Manage your earnings and transaction history.</p>
        </div>
        <Button
          className="rounded-lg bg-green-500 hover:bg-green-600 transition-all text-sm h-10 px-4 font-bold text-white shadow-lg shadow-green-500/20"
          disabled={data.balance === 0}
        >
          <Wallet className="mr-2 h-4 w-4" /> Withdraw Funds
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-4 md:mx-0">
        <Card className="shadow-2xl border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
              Total Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-slate-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-100 leading-none">
              {formatCurrency(data.balance)}
            </div>
            <div className="flex items-center pt-2 text-[10px] text-green-400 font-bold uppercase tracking-tight">
              <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
              <span>+12.5% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
              Today's Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-100 leading-none">
              {formatCurrency(data.todaysRevenue)}
            </div>
            <div className="flex items-center pt-2 text-[10px] text-green-400 font-bold uppercase tracking-tight">
              <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
              <span>+20.1% growth</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
              Active Supporters
            </CardTitle>
            <Users className="h-4 w-4 text-slate-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-100 leading-none">
              {data.activeSupporters}
            </div>
            <div className="flex items-center pt-2 text-[10px] text-blue-400 font-bold uppercase tracking-tight">
              <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
              <span>+4 new this week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mx-4 md:mx-0">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-100">Recent Transactions</h3>
          <DateRangeFilter />
        </div>
        <TransactionsTable transactions={data.transactions} />
      </div>
    </div>
  );
}
