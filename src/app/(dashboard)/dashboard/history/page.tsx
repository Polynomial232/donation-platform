import { Button } from "@/components/ui/button";
import { Download, Wallet, CreditCard, TrendingUp } from "lucide-react";
import { DateRangeFilter } from "@/components/ui/date-range-filter";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { DailyActivityChart } from "@/components/dashboard/DailyActivityChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define Types
interface Transaction {
  id: number;
  name: string;
  email?: string;
  amount: number;
  message: string;
  type: "income" | "expense";
  tags?: string[];
  remarks?: string;
  time: Date;
}

interface HistoryData {
  transactions: Transaction[];
  monthlyRevenue: number;
  totalRevenue: number;
}

export default function HistoryPage({
  searchParams,
}: {
  searchParams: { from?: string; to?: string };
}) {
  // Generate dummy data (Consistent)
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
        remarks: isIncome ? (Math.random() > 0.8 ? "Sensitive Content" : "Safe") : undefined,
        time: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i * 2)),
      });
    }
    return data;
  };

  const today = new Date();
  const defaultFrom = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const defaultTo = new Date(today.getFullYear(), today.getMonth(), 0);

  const fromDate = searchParams.from ? new Date(searchParams.from) : defaultFrom;
  const toDate = searchParams.to ? new Date(searchParams.to) : defaultTo;

  const allTransactions = generateDummyTransactions();
  const filteredTransactions = allTransactions.filter(
    (t) => t.time >= fromDate && t.time <= toDate
  );

  const data: HistoryData = {
    transactions: filteredTransactions,
    monthlyRevenue: 6420000,
    totalRevenue: 24500000,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4 md:px-0">
        <div>
          <h2 className="text-2xl font-medium text-slate-100 italic tracking-tight">
            TRANSACTION HISTORY
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Deep dive into your financial logs and growth trends.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-xl border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white h-10 px-4 font-bold text-xs"
          >
            <Download size={16} className="mr-2" /> EXPORT REPORT
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-4 md:mx-0">
        <Card className="shadow-2xl border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
              Earnings This Month
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-100 leading-none">
              {formatCurrency(data.monthlyRevenue)}
            </div>
            <div className="flex items-center pt-2 text-[10px] text-green-400 font-bold uppercase tracking-tight">
              <TrendingUp className="mr-1 h-3.5 w-3.5" />
              <span>+14.2% growth</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
              Total Lifetime Revenue
            </CardTitle>
            <CreditCard className="h-4 w-4 text-slate-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-100 leading-none">
              {formatCurrency(data.totalRevenue)}
            </div>
            <div className="flex items-center pt-2 text-[10px] text-blue-400 font-bold uppercase tracking-tight">
              <Wallet className="mr-1 h-3.5 w-3.5" />
              <span>Verified Profit</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
              Selected Range Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-100 leading-none">
              {formatCurrency(
                filteredTransactions.reduce(
                  (acc, t) => acc + (t.type === "income" ? t.amount : 0),
                  0
                )
              )}
            </div>
            <div className="flex items-center pt-2 text-[10px] text-purple-400 font-bold uppercase tracking-tight">
              <span>{filteredTransactions.length} transactions in range</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-4 md:mx-0">
        <RevenueChart />
        <DailyActivityChart />
      </div>

      <div className="mx-4 md:mx-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="size-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] anim-pulse" />
            <h3 className="text-lg font-bold text-slate-100">Live Transaction Logs</h3>
          </div>
          <DateRangeFilter />
        </div>
        <TransactionsTable transactions={data.transactions} />
      </div>
    </div>
  );
}
