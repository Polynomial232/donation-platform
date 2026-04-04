"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Trophy, Crown, Medal } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

const topSupporters = [
  {
    name: "Sultan Gabut",
    amount: "IDR 15.000.000",
    avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
    rank: 1,
  },
  {
    name: "Anak Sultan",
    amount: "IDR 8.500.000",
    avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
    rank: 2,
  },
  {
    name: "Hamba Allah",
    amount: "IDR 3.000.000",
    avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
    rank: 3,
  },
  {
    name: "Fanboy Garis Keras",
    amount: "IDR 1.500.000",
    avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
    rank: 4,
  },
  {
    name: "Secret Admirer",
    amount: "IDR 500.000",
    avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
    rank: 5,
  },
];

const fullLeaderboard = [
  ...topSupporters,
  {
    name: "Supporter 6",
    amount: "IDR 450.000",
    avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
    rank: 6,
  },
  {
    name: "Supporter 7",
    amount: "IDR 400.000",
    avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
    rank: 7,
  },
  {
    name: "Supporter 8",
    amount: "IDR 350.000",
    avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
    rank: 8,
  },
  {
    name: "Supporter 9",
    amount: "IDR 300.000",
    avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
    rank: 9,
  },
  {
    name: "Supporter 10",
    amount: "IDR 250.000",
    avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
    rank: 10,
  },
  {
    name: "Supporter 11",
    amount: "IDR 200.000",
    avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
    rank: 11,
  },
  {
    name: "Supporter 12",
    amount: "IDR 150.000",
    avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
    rank: 12,
  },
  {
    name: "Supporter 13",
    amount: "IDR 100.000",
    avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
    rank: 13,
  },
  {
    name: "Supporter 14",
    amount: "IDR 50.000",
    avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
    rank: 14,
  },
  {
    name: "Supporter 15",
    amount: "IDR 10.000",
    avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
    rank: 15,
  },
];

interface Supporter {
  id: string;
  name: string;
  amount: string;
  avatar: string;
  rank: number;
}

export function LeaderboardWidget({ data }: { data?: any[] }) {
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);

  // Map API data to component data
  const supporters: Supporter[] = (data || []).map((item, index) => ({
    id: item.id || Math.random().toString(),
    name: item.donor_name || "Nameless Knight",
    amount: `IDR ${item.total_amount?.toLocaleString("id-ID") || 0}`,
    avatar: item.avatar_url || "https://i.imgur.com/1Z3MVNG.jpeg",
    rank: index + 1,
  }));

  const topSupportersList = supporters.slice(0, 5);
  const fullLeaderboardList = supporters;

  const SupporterItem = ({ supporter }: { supporter: Supporter }) => (
    <div className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors">
      <div className="shrink-0 w-6 text-center font-bold text-slate-400 text-xs">
        {supporter.rank === 1 && (
          <Crown size={20} className="text-yellow-500 mx-auto" fill="currentColor" />
        )}
        {supporter.rank === 2 && <Medal size={20} className="text-slate-400 mx-auto" />}
        {supporter.rank === 3 && <Medal size={20} className="text-amber-700 mx-auto" />}
        {supporter.rank > 3 && `#${supporter.rank}`}
      </div>
      <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden relative border border-slate-100 shrink-0">
        <Image src={supporter.avatar} alt={supporter.name} fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-900 truncate">{supporter.name}</p>
        <p className="text-[10px] text-purple-800 font-bold">{supporter.amount}</p>
      </div>
    </div>
  );

  return (
    <>
      <Card className="border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
        <div className="bg-slate-50/80 px-5 py-4 flex items-center gap-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
            <Trophy size={16} className="text-purple-800" fill="currentColor" />
          </div>
          <h1 className="text-sm font-extrabold text-slate-900 tracking-tight">Royal Champions</h1>
        </div>
        <div className="p-2">
          {topSupportersList.length > 0 ? (
            topSupportersList.map((supporter, index) => (
              <SupporterItem key={supporter.id} supporter={supporter} />
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-xs text-slate-400 font-bold">No supporters yet</p>
            </div>
          )}
        </div>
        {fullLeaderboardList.length > 5 && (
          <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50">
            <button
              onClick={() => setIsViewAllOpen(true)}
              className="text-[11px] font-bold text-slate-500 hover:text-(--color-deep-purple) transition-colors tracking-wide"
            >
              Consult all records
            </button>
          </div>
        )}
      </Card>

      <Modal isOpen={isViewAllOpen} onClose={() => setIsViewAllOpen(false)} title="Tribute Records">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-1">
            {fullLeaderboardList.map((supporter, index) => (
              <SupporterItem key={supporter.id} supporter={supporter} />
            ))}
          </div>
        </ScrollArea>
        <div className="text-center mt-4">
          <button
            onClick={() => setIsViewAllOpen(false)}
            className="text-xs font-bold text-slate-400 hover:text-slate-600"
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
}
