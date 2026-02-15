
import { Card } from "@/components/ui/card";
import { Pin, MessageCircle } from "lucide-react";
import Image from "next/image";

const pinnedItems = [
    {
        name: "Sultan Gabut",
        amount: "Rp 5.000.000",
        avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
        message: "Semangat terus streamingnya bang! Semoga PC barunya cepet kebeli. Ditunggu konten horrornya lagi! 👻🔥"
    },
    {
        name: "Windah Basudara",
        amount: "Rp 2.500.000",
        avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
        message: "Mantap kontennya! Sukses selalu bro. Jangan lupa istirahat."
    },
    {
        name: "Misterius",
        amount: "Rp 1.000.000",
        avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
        message: "Titip salam buat kucingnya 😺"
    }
];

export function PinnedWidget() {
    return (
        <Card className="border-none shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_8px_-1px_rgba(0,0,0,0.02)] rounded-2xl overflow-hidden divide-y divide-slate-50">
            <div className="bg-[var(--color-pastel-purple)] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Pin size={16} className="text-[var(--color-deep-purple)]" fill="currentColor" />
                    <h3 className="text-xs font-black text-[var(--color-deep-purple)] uppercase tracking-widest">Pinned Donations</h3>
                </div>
                <span className="bg-white/50 text-[var(--color-deep-purple)] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {pinnedItems.length}
                </span>
            </div>

            {pinnedItems.map((item, idx) => (
                <div key={idx} className="p-5 space-y-3">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden relative border-2 border-white shadow-sm flex-shrink-0">
                            <Image src={item.avatar} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 leading-tight">{item.name}</p>
                            <p className="text-xs text-[var(--color-deep-purple)] font-bold bg-[var(--color-pastel-purple)] px-2 py-0.5 rounded-md inline-block mt-1">
                                {item.amount}
                            </p>
                        </div>
                    </div>
                    {item.message && (
                        <div className="bg-slate-50 p-3 rounded-xl relative">
                            <MessageCircle size={16} className="absolute -top-2 left-4 text-slate-200 fill-slate-200" />
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
