import { Navbar } from "@/components/Navbar";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const following = [
  { username: "Windah Basudara", status: "Live Now", avatar: "https://i.imgur.com/1Z3MVNG.jpeg" },
  { username: "GadgetIn", status: "Offline", avatar: "https://i.imgur.com/1Z3MVNG.jpeg" },
];

export default function FollowingPage() {
  return (
    <main className="min-h-screen bg-[var(--color-off-white)] pb-12">
      <div className="max-w-2xl mx-auto px-4 pt-8 space-y-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Following</h1>
        <div className="space-y-4">
          {following.map((creator, idx) => (
            <Link href={`/${creator.username}`} key={idx} className="block group">
              <Card className="p-4 flex items-center justify-between border-none shadow-sm hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden relative">
                    <Image src={creator.avatar} alt="Avatar" fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-[var(--color-deep-purple)] transition-colors">
                      {creator.username}
                    </h3>
                    <p
                      className={`text-xs font-bold ${creator.status === "Live Now" ? "text-red-500 animate-pulse" : "text-slate-400"}`}
                    >
                      {creator.status}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl font-bold text-xs pointer-events-none"
                >
                  Support
                </Button>
              </Card>
            </Link>
          ))}
          {following.length === 0 && (
            <div className="text-center py-10 text-slate-400">
              <p>You are not following anyone yet.</p>
              <Link href="/explore" className="text-[var(--color-deep-purple)] font-bold underline">
                Find creators
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
