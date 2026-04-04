"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { discoveryService } from "@/services/discovery";
import Link from "next/link";
import { Search, ArrowRight, Compass, Loader2, BadgeCheck } from "lucide-react";
import { HeroCollage } from "@/components/ui/modern-hero-section";
import { useDebounce } from "@/hooks/use-debounce";
import { BGPattern } from "@/components/ui/bg-pattern";

export default function LandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 400);

  const landingQuery = useQuery({
    queryKey: ["landing-data"],
    queryFn: discoveryService.getLanding,
    refetchOnWindowFocus: true,
  });

  // Live search query — only fires when debounced value is non-empty
  const searchResultsQuery = useQuery({
    queryKey: ["landing-search", debouncedSearch],
    queryFn: () =>
      discoveryService.getCreators({
        pageParam: 1,
        limit: 5,
        search: debouncedSearch,
      }),
    enabled: debouncedSearch.trim().length >= 2,
  });

  useEffect(() => {
    if (!landingQuery.isError) return;

    const error = landingQuery.error as any;
    const errorMessage =
      error?.response?.data?.message || error?.message || "Gagal memuat data landing";
    toast.error(errorMessage);
  }, [landingQuery.isError, landingQuery.error]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    setIsSearchFocused(false);
    if (!trimmed) {
      router.push("/explore");
      return;
    }
    router.push(`/explore?search=${encodeURIComponent(trimmed)}`);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    handleSearch();
  };

  if (landingQuery.isLoading || !landingQuery.data?.data) {
    return (
      <main className="min-h-screen bg-(--color-off-white) flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-(--color-deep-purple) border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Bentar ya...</p>
        </div>
      </main>
    );
  }

  const landing = landingQuery.data.data;
  const hero = landing?.hero;

  const formatStat = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M+";
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K+";
    return num.toString() + "+";
  };

  const stats = [
    { value: formatStat(landing?.stats?.total_donations || 0), label: "Tributes Bestowed" },
    { value: formatStat(landing?.stats?.total_creators || 0), label: "Sovereigns Enlisted" },
  ];

  const trendingImages = (landing.trending_creators || []).map((c: any) => ({
    src:
      c.banner_url || c.avatar_url || "https://images.unsplash.com/photo-1543852786-1cf6624b9987",
    username: c.username,
  }));

  const collageImages = [...trendingImages];

  const searchResults = searchResultsQuery.data?.data || [];
  const isSearching = debouncedSearch.trim().length >= 2;
  const showDropdown = isSearchFocused && isSearching;

  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Premium Background Pattern */}
      <BGPattern
        variant="grid"
        size={32}
        fill="rgba(0,0,0,0.04)"
        className="fixed inset-0 z-0 pointer-events-none"
      />

      {/* Decorative Glowing Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-(--color-pastel-purple) mix-blend-multiply blur-[120px] opacity-50 z-0 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-(--color-pastel-yellow) mix-blend-multiply blur-[120px] opacity-40 z-0 pointer-events-none"></div>

      <div className="relative z-10">
        <HeroCollage
          title={
            <>
              {hero.title.split(" ").map((word: string, i: number) => (
                <span key={i} className={i === 1 ? "text-(--color-deep-purple)" : ""}>
                  {word}{" "}
                </span>
              ))}
            </>
          }
          subtitle={hero.subtitle}
          stats={stats}
          images={collageImages}
        />

        {/* Search & CTA — tighter spacing, overlaps the collage bottom */}
        <div className="max-w-2xl mx-auto px-5 pb-24 -mt-6 relative z-20">
          <section className="text-center space-y-6">
            {/* Search with live dropdown */}
            <div ref={searchContainerRef} className="relative max-w-lg mx-auto">
              <div
                className={`
                bg-white shadow-2xl shadow-purple-100/80 rounded-[28px] p-2 flex items-center gap-2 border transition-all duration-300
                ${
                  isSearchFocused
                    ? "border-(--color-accent-purple) shadow-purple-200/60 scale-[1.01]"
                    : "border-slate-100"
                }
              `}
              >
                <div className="pl-3 text-slate-400">
                  {searchResultsQuery.isFetching ? (
                    <Loader2 size={18} className="animate-spin text-(--color-deep-purple)" />
                  ) : (
                    <Search size={18} />
                  )}
                </div>
                <input
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium py-2.5 outline-none placeholder:text-slate-400"
                  placeholder={hero.search_placeholder}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  onFocus={() => setIsSearchFocused(true)}
                />
                <button
                  onClick={handleSearch}
                  className="bg-(--color-accent-yellow) p-2.5 rounded-xl hover:bg-(--color-pastel-yellow) hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <ArrowRight className="text-(--color-deep-purple) block" size={18} />
                </button>
              </div>

              {/* Live search dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl shadow-purple-100/40 border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {searchResultsQuery.isFetching && searchResults.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <Loader2
                        size={20}
                        className="animate-spin text-(--color-deep-purple) mx-auto mb-2"
                      />
                      <p className="text-xs text-slate-400 font-medium">Seeking Sovereigns...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map((creator: any) => (
                        <Link
                          key={creator.id ?? creator.username}
                          href={`/${creator.username}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group"
                          onClick={() => setIsSearchFocused(false)}
                        >
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 relative shrink-0">
                            {creator.avatar_url ? (
                              <Image
                                src={creator.avatar_url}
                                alt={creator.display_name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-(--color-pastel-purple) flex items-center justify-center text-(--color-deep-purple) font-bold text-sm">
                                {(creator.display_name || creator.username)
                                  ?.charAt(0)
                                  ?.toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate group-hover:text-(--color-deep-purple) transition-colors flex items-center gap-1">
                              {creator.display_name || creator.username}
                              {creator.is_verified && (
                                <BadgeCheck
                                  size={14}
                                  className="text-(--color-accent-purple) shrink-0"
                                />
                              )}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                              @{creator.username}
                              {creator.categories?.[0] && ` · ${creator.categories[0]}`}
                            </p>
                          </div>
                          <ArrowRight
                            size={14}
                            className="text-slate-300 group-hover:text-(--color-deep-purple) transition-colors shrink-0"
                          />
                        </Link>
                      ))}
                      <button
                        onClick={handleSearch}
                        className="w-full px-4 py-3 text-xs font-bold text-(--color-deep-purple) bg-slate-50 hover:bg-pastel-purple/40 transition-colors text-center border-t border-slate-100"
                      >
                        View all results for &quot;{searchQuery}&quot;
                      </button>
                    </>
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <p className="text-sm text-slate-500 font-medium">No Sovereigns found</p>
                      <p className="text-xs text-slate-400 mt-1">Try another decree</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 bg-(--color-deep-purple) text-white font-bold text-sm px-7 py-3.5 rounded-full shadow-lg shadow-purple-200 hover:scale-[1.03] active:scale-[0.98] transition-all"
              >
                <Compass size={16} />
                Explore the Kingdom
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-white text-(--color-deep-purple) font-bold text-sm px-7 py-3.5 rounded-full shadow-lg shadow-slate-100 border border-slate-200 hover:scale-[1.03] active:scale-[0.98] transition-all"
              >
                Join the Court
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
