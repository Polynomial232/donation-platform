"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Search, Flame, BadgeCheck, Palette, Music, Video, Paintbrush, Flag, Check } from "lucide-react";

// Mock Data for Trending
const trendingCreators = [
    {
        username: "Kaira Arcsladivya",
        role: "Digital Artist",
        category: "Artist",
        banner: "https://i.imgur.com/1Z3MVNG.jpeg",
        avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
        bio: "Daging untuk majikan sejahtera ✨",
        isHot: true
    },
    {
        username: "Pixel Master",
        role: "Pixel Artist",
        category: "Artist",
        banner: "https://i.imgur.com/1Z3MVNG.jpeg",
        avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
        bio: "Creating retro worlds one pixel at a time..."
    },
    {
        username: "Windah Basudara",
        role: "Gamer",
        category: "Gamer",
        banner: "https://i.imgur.com/1Z3MVNG.jpeg",
        avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
        bio: "Bocil kematian let's go!! 🎮",
        isHot: true
    },
];

// Mock Data for Recommended
const recommendedCreators = [
    {
        username: "Artvark Design",
        role: "Branding Specialist",
        category: "Artist",
        avatar: "https://i.imgur.com/1Z3MVNG.jpeg",
        icon: null
    },
    {
        username: "Canvas Queen",
        role: "Oil Painter",
        category: "Artist",
        avatar: null,
        icon: <Paintbrush className="text-[var(--color-deep-purple)]" size={32} />,
        bgColor: "bg-yellow-50",
        borderColor: "border-[var(--color-pastel-yellow)]"
    },
    {
        username: "Lo-Fi Beats",
        role: "Music Producer",
        category: "Musician",
        avatar: null,
        icon: <Music className="text-[var(--color-deep-purple)]" size={32} />,
        bgColor: "bg-purple-50",
        borderColor: "border-[var(--color-pastel-purple)]"
    },
    {
        username: "Vlog Central",
        role: "Storyteller",
        category: "Vlogger",
        avatar: null,
        icon: <Video className="text-slate-400" size={32} />,
        bgColor: "bg-slate-50",
        borderColor: "border-slate-100"
    },
];

const allCreators = [
    ...trendingCreators,
    ...recommendedCreators,
    { username: "NightRider_TV", role: "Gamer", category: "Gamer", avatar: "https://i.imgur.com/1Z3MVNG.jpeg", bio: "Professional racer and variety streamer. 🏁" },
    { username: "Studio Ghibly Vibes", role: "Artist", category: "Artist", avatar: "https://i.imgur.com/1Z3MVNG.jpeg", bio: "Drawing daily landscapes and cozy rooms." },
];

const categories = ["All Creators", "Gamers", "Artists", "Musicians", "VTubers", "Podcasters"];

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Creators");

    const isSearching = searchQuery.trim().length > 0 || selectedCategory !== "All Creators";

    const filteredCreators = allCreators.filter((creator) => {
        const matchesSearch = creator.username.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All Creators" || creator.category + "s" === selectedCategory || creator.category === selectedCategory || (selectedCategory === "Artists" && creator.category === "Artist");
        return matchesSearch && matchesCategory;
    });

    return (
        <main className="min-h-screen bg-[var(--color-off-white)] pb-24">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Search Header (Sticky) */}
                <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
                    {/* Search Input */}
                    <div className="px-6 pb-2">
                        <div className="relative group max-w-2xl mx-auto md:mx-0">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--color-deep-purple)] transition-colors" size={20} />
                            <input
                                className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[var(--color-pastel-purple)] transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400"
                                placeholder="Search creators..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Category Pills */}
                    <div className="px-6 pb-4">
                        <div className="flex gap-2 overflow-x-auto no-scrollbar">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-colors shadow-sm ${selectedCategory === cat
                                        ? "bg-[var(--color-accent-yellow)] text-[var(--color-deep-purple)]"
                                        : "bg-white text-slate-500 hover:bg-slate-50"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CONTENT AREA: Toggle between Default View (Trending) and Search Results */}
                {!isSearching ? (
                    <>
                        {/* Trending Section */}
                        <section className="mt-2">
                            <div className="px-6 flex justify-between items-end mb-4">
                                <div>
                                    <h2 className="text-xl font-extrabold text-slate-900">Trending Creators</h2>
                                    <p className="text-xs text-slate-400 font-medium">Top picks this week 🔥</p>
                                </div>
                                <Link href="#">
                                    <span className="text-xs font-bold text-[var(--color-deep-purple)]">View all</span>
                                </Link>
                            </div>

                            <div className="flex gap-4 overflow-x-auto px-6 pb-6 hide-scrollbar snap-x">
                                {trendingCreators.map((creator, idx) => (
                                    <Link href={`/${creator.username}`} key={idx} className="block group snap-center">
                                        <div className="bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.02),0_8px_10px_-6px_rgba(0,0,0,0.02)] rounded-[24px] min-w-[280px] w-[280px] overflow-hidden flex flex-col cursor-pointer transition-transform hover:scale-[1.02]">
                                            <div className="h-32 relative">
                                                <Image src={creator.banner} alt="Banner" fill className="object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                                {creator.isHot && (
                                                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                                        <div className="bg-[var(--color-accent-yellow)] text-[var(--color-deep-purple)] text-[10px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                                                            HOT <Flame size={10} fill="currentColor" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4 flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-xl border-2 border-white shadow-sm overflow-hidden relative">
                                                            <Image src={creator.avatar} alt="Avatar" fill className="object-cover" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-sm text-slate-900 group-hover:text-[var(--color-deep-purple)] transition-colors">{creator.username}</h3>
                                                            <p className="text-[11px] text-slate-500">{creator.role}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="mt-3 text-xs text-slate-600 line-clamp-1 italic">"{creator.bio}"</p>
                                                <div className="mt-4 flex gap-2">
                                                    <Button className="flex-1 bg-[var(--color-accent-yellow)] text-[var(--color-deep-purple)] font-bold py-2.5 rounded-xl text-xs hover:bg-[var(--color-pastel-yellow)]">
                                                        Support
                                                    </Button>
                                                    <Button variant="secondary" className="px-3 bg-[var(--color-pastel-purple)] text-[var(--color-deep-purple)] font-bold py-2.5 rounded-xl text-xs hover:bg-purple-200">
                                                        Follow
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* Recommended Section */}
                        <section className="mt-4 px-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-lg font-extrabold text-slate-900">Recommended for You</h2>
                                    <p className="text-[11px] text-slate-400 font-medium">Based on your interests in <span className="text-[var(--color-deep-purple)] font-bold">Art & Design</span></p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {recommendedCreators.map((creator, idx) => (
                                    <Link href={`/${creator.username}`} key={idx} className="block group">
                                        <div className="bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.02),0_8px_10px_-6px_rgba(0,0,0,0.02)] rounded-[24px] p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-all h-full">
                                            <div className="relative mb-3">
                                                {creator.avatar ? (
                                                    <div className="w-16 h-16 rounded-full border-2 border-[var(--color-pastel-purple)] overflow-hidden relative">
                                                        <Image src={creator.avatar} alt="Avatar" fill className="object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${creator.borderColor} ${creator.bgColor}`}>
                                                        {creator.icon}
                                                    </div>
                                                )}
                                                {idx === 0 && <div className="absolute -bottom-1 -right-1 bg-green-400 w-4 h-4 rounded-full border-2 border-white"></div>}
                                            </div>
                                            <h3 className="font-bold text-xs text-slate-900 group-hover:text-[var(--color-deep-purple)] transition-colors">{creator.username}</h3>
                                            <p className="text-[10px] text-slate-400 mt-1 mb-4">{creator.role}</p>
                                            <div className="w-full space-y-2 mt-auto">
                                                <Button className="w-full bg-[var(--color-accent-yellow)] text-[var(--color-deep-purple)] font-bold py-2 rounded-lg text-[10px] h-auto hover:bg-[var(--color-pastel-yellow)]">
                                                    Support
                                                </Button>
                                                <Button variant="secondary" className="w-full bg-[var(--color-pastel-purple)] text-[var(--color-deep-purple)] font-bold py-2 rounded-lg text-[10px] h-auto hover:bg-purple-200">
                                                    Follow
                                                </Button>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </>
                ) : (
                    /* Search Results View */
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

                        {/* Results Grid - Using Design 3 List Style for Search Results */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredCreators.map((creator, idx) => (
                                <Link href={`/${creator.username}`} key={idx} className="block group">
                                    <Card className="p-4 flex gap-4 items-center border-none shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_8px_-1px_rgba(0,0,0,0.02)] rounded-[20px] hover:shadow-md transition-shadow cursor-pointer">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 relative">
                                                {creator.avatar ? <Image src={creator.avatar} alt="Avatar" fill className="object-cover" /> : creator.icon}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 bg-[var(--color-accent-yellow)] text-[var(--color-deep-purple)] rounded-full p-0.5 border-2 border-white">
                                                <Check size={10} strokeWidth={4} />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div className="pr-2">
                                                    <h3 className="font-extrabold text-sm text-slate-900 truncate group-hover:text-[var(--color-deep-purple)] transition-colors">{creator.username}</h3>
                                                    <span className="text-[10px] font-bold text-[var(--color-deep-purple)] bg-[var(--color-pastel-purple)] px-2 py-0.5 rounded-full inline-block mt-0.5">
                                                        {creator.category || creator.role}
                                                    </span>
                                                </div>
                                                <div className="bg-[var(--color-pastel-yellow)] hover:bg-[var(--color-accent-yellow)] text-[var(--color-deep-purple)] px-4 py-1.5 rounded-full text-[10px] font-bold transition-colors whitespace-nowrap">
                                                    Support
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-2 line-clamp-1 italic">{creator.bio || "No bio available"}</p>
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
                    </div>
                )}


            </div>

            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
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
