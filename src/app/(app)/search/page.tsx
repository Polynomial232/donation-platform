"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Search, BadgeCheck, Flag, Check, Bell } from "lucide-react";

const categories = ["All Creators", "Gamers", "Artists", "Musicians", "VTubers", "Podcasters"];

const allCreators = [
  {
    username: "Kaira Arcsladivya",
    category: "Musician",
    avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
    bio: "Creating cozy lofi beats for your study sessions ✨",
  },
  {
    username: "Pixel Wizard",
    category: "Artist",
    avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
    bio: "Pixel art and retro game assets creator.",
  },
  {
    username: "NightRider_TV",
    category: "Gamer",
    avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
    bio: "Professional racer and variety streamer. 🏁",
  },
  {
    username: "Studio Ghibly Vibes",
    category: "Artist",
    avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
    bio: "Drawing daily landscapes and cozy rooms.",
  },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Creators");

  const filteredCreators = allCreators.filter((creator) => {
    const matchesSearch = creator.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Creators" ||
      creator.category + "s" === selectedCategory ||
      creator.category === selectedCategory ||
      (selectedCategory === "Artists" && creator.category === "Artist"); // Simple plural handling
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-[var(--color-off-white)] pb-24">
      {/* Custom Navbar for Search Page mimicking Design 3 */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-4 py-3 border-b border-slate-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[var(--color-accent-yellow)] rounded-lg flex items-center justify-center text-[var(--color-deep-purple)] font-black text-sm">
              D
            </div>
            <span className="font-bold text-base tracking-tight text-slate-900">DukuNasia</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-full bg-[var(--color-pastel-purple)] flex items-center justify-center text-[var(--color-deep-purple)]">
              <Bell size={18} />
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 border border-slate-100">
              <Image
                src="https://i.imgur.com/1Z3MVNG.jpeg"
                alt="User"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--color-deep-purple)] transition-colors"
            size={20}
          />
          <input
            className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[var(--color-pastel-purple)] transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400"
            placeholder="Search creators..."
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-colors shadow-sm ${
                selectedCategory === cat
                  ? "bg-[var(--color-accent-yellow)] text-[var(--color-deep-purple)]"
                  : "bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      <div className="px-4 mt-4 space-y-6">
        {/* Filters */}
        <section className="flex gap-3 items-center">
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl shadow-sm text-[11px] font-bold text-slate-600">
            <BadgeCheck size={16} className="text-[var(--color-accent-purple)] fill-current" />
            Verified Only
            <div className="w-6 h-3 bg-[var(--color-pastel-purple)] rounded-full relative ml-1">
              <div className="absolute right-0.5 top-0.5 w-2 h-2 bg-[var(--color-deep-purple)] rounded-full"></div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl shadow-sm text-[11px] font-bold text-slate-600">
            <Flag size={16} className="text-[var(--color-accent-purple)]" />
            Active Goals
          </div>
        </section>

        {/* Results Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredCreators.map((creator, idx) => (
            <Link href={`/${creator.username}`} key={idx} className="block group">
              <Card className="p-4 flex gap-4 items-center border-none shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_8px_-1px_rgba(0,0,0,0.02)] rounded-[20px] hover:shadow-md transition-shadow cursor-pointer">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 relative">
                    <Image src={creator.avatar} alt="Avatar" fill className="object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[var(--color-accent-yellow)] text-[var(--color-deep-purple)] rounded-full p-0.5 border-2 border-white">
                    <Check size={10} strokeWidth={4} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="pr-2">
                      <h3 className="font-extrabold text-sm text-slate-900 truncate group-hover:text-[var(--color-deep-purple)] transition-colors">
                        {creator.username}
                      </h3>
                      <span className="text-[10px] font-bold text-[var(--color-deep-purple)] bg-[var(--color-pastel-purple)] px-2 py-0.5 rounded-full inline-block mt-0.5">
                        {creator.category}
                      </span>
                    </div>
                    <div className="bg-[var(--color-pastel-yellow)] hover:bg-[var(--color-accent-yellow)] text-[var(--color-deep-purple)] px-4 py-1.5 rounded-full text-[10px] font-bold transition-colors whitespace-nowrap">
                      Support
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-1 italic">{creator.bio}</p>
                </div>
              </Card>
            </Link>
          ))}

          {filteredCreators.length === 0 && (
            <div className="text-center py-10 text-slate-400">
              <p>No creators found matching your criteria.</p>
            </div>
          )}
        </div>

        <div className="flex justify-center py-6">
          <button className="text-xs font-bold text-[var(--color-deep-purple)] px-6 py-3 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
            Show more creators
          </button>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
