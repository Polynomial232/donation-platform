import { Card } from "@/components/ui/card";
import { Pin, MessageCircle } from "lucide-react";
import Image from "next/image";

const pinnedItems = [
  {
    name: "Sultan Gabut",
    amount: "IDR 5.000.000",
    avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
    message:
      "Semangat terus streamingnya bang! Semoga PC barunya cepet kebeli. Ditunggu konten horrornya lagi! 👻🔥",
  },
  {
    name: "Windah Basudara",
    amount: "IDR 2.500.000",
    avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
    message: "Mantap kontennya! Sukses selalu bro. Jangan lupa istirahat.",
  },
  {
    name: "Misterius",
    amount: "IDR 1.000.000",
    avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
    message: "Titip salam buat kucingnya 😺",
  },
];

export function PinnedWidget({ data }: { data?: any[] }) {
  const items = (data || []).map((item) => ({
    name: item.donorName,
    amount: `IDR ${item.amount?.toLocaleString("id-ID")}`,
    avatar: item.donorAvatar || item.donor?.avatarUrl || "https://i.imgur.com/1Z3MVNG.jpeg",
    message: item.message,
  }));

  if (items.length === 0) return null;

  return (
    <Card className="border border-slate-100 shadow-sm rounded-3xl bg-white overflow-hidden">
      <div className="bg-slate-50/80 px-5 py-4 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-(--color-pastel-purple) flex items-center justify-center shrink-0">
            <Pin size={16} className="text-(--color-deep-purple)" fill="currentColor" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Pinned Support</h3>
        </div>
        <span className="bg-white/50 text-(--color-deep-purple) text-[10px] font-bold px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>

      {items.map((item, idx) => (
        <div key={idx} className="p-5 space-y-3">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden relative border-2 border-white shadow-sm shrink-0">
              <Image src={item.avatar} alt={item.name} fill className="object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-tight">{item.name}</p>
              <p className="text-xs text-(--color-deep-purple) font-bold bg-(--color-pastel-purple) px-2 py-0.5 rounded-md inline-block mt-1">
                {item.amount}
              </p>
            </div>
          </div>
          {item.message && (
            <div className="bg-slate-50 p-3 rounded-xl relative">
              <MessageCircle
                size={16}
                className="absolute -top-2 left-4 text-slate-200 fill-slate-200"
              />
              <p className="text-xs text-slate-600 italic leading-relaxed relative z-10 font-medium">
                "{item.message}"
              </p>
            </div>
          )}
        </div>
      ))}
    </Card>
  );
}
