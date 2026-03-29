"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { discoveryService } from "@/services/discovery";
import { useDebounce } from "@/hooks/use-debounce";
import { BGPattern } from "@/components/ui/bg-pattern";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Search, Flame, BadgeCheck, Loader2, X, Sparkles, TrendingUp, Users } from "lucide-react";

// --- Reusable Creator Card (banner + avatar style) ---
function CreatorCard({ creator }: { creator: any }) {
  return (
    <div className="flex-[0_0_auto] pl-4">
      <Link href={`/${creator.username}`} className="block group" draggable={false}>
        <div className="bg-white rounded-2xl min-w-[260px] w-[260px] overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-sm border border-slate-100/60">
          {/* Banner */}
          <div className="h-28 relative">
            <Image
              src={creator.banner}
              alt="Banner"
              fill
              className="object-cover"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
            {creator.isHot && (
              <div className="absolute bottom-2.5 left-2.5">
                <div className="bg-(--color-accent-yellow) text-(--color-deep-purple) text-[10px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                  HOT <Flame size={10} fill="currentColor" />
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3.5 flex-1 flex flex-col">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl border-2 border-white shadow-sm overflow-hidden relative shrink-0 -mt-7">
                <Image
                  src={creator.avatar}
                  alt="Avatar"
                  fill
                  className="object-cover"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-(--color-deep-purple) transition-colors flex items-center gap-1 truncate">
                  {creator.displayName}
                  {creator.isVerified && (
                    <BadgeCheck
                      size={13}
                      className="text-(--color-accent-purple) fill-(--color-pastel-purple) shrink-0"
                    />
                  )}
                </h3>
                <p className="text-[11px] text-slate-400 truncate">{creator.role}</p>
              </div>
            </div>

            {creator.bio && (
              <p className="mt-2.5 text-xs text-slate-500 line-clamp-1 italic">
                &quot;{creator.bio}&quot;
              </p>
            )}

            <div className="mt-3 flex gap-2">
              <Button className="px-5 bg-(--color-accent-yellow) text-(--color-deep-purple) font-bold rounded-xl text-xs hover:bg-(--color-pastel-yellow) h-8">
                Tribute
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="px-3 bg-(--color-pastel-purple) text-(--color-deep-purple) font-bold rounded-xl text-xs hover:bg-purple-200 h-8"
              >
                Enlist
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// --- Compact Grid Card (avatar-centric) ---
function CreatorGridCard({ creator }: { creator: any }) {
  return (
    <Link href={`/${creator.username}`} className="block group">
      <div className="bg-white rounded-2xl p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition-all duration-300 h-full border border-slate-100/60">
        <div className="relative mb-3">
          <div className="w-14 h-14 rounded-full border-2 border-(--color-pastel-purple) overflow-hidden relative">
            <Image src={creator.avatar} alt="Avatar" fill className="object-cover" />
          </div>
          {creator.isHot && (
            <div className="absolute -bottom-0.5 -right-0.5 bg-(--color-accent-yellow) w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
              <Flame size={10} className="text-(--color-deep-purple)" fill="currentColor" />
            </div>
          )}
        </div>
        <h3 className="font-bold text-xs text-slate-900 group-hover:text-(--color-deep-purple) transition-colors line-clamp-1 break-all flex items-center gap-1 justify-center">
          {creator.displayName}
          {creator.isVerified && (
            <BadgeCheck
              size={12}
              className="text-(--color-accent-purple) fill-(--color-pastel-purple) shrink-0"
            />
          )}
        </h3>
        <p className="text-[10px] text-slate-400 mt-0.5 mb-3">{creator.role}</p>
        <div className="w-full space-y-1.5 mt-auto">
          <Button className="w-full bg-(--color-accent-yellow) text-(--color-deep-purple) font-bold py-1.5 rounded-lg text-[10px] h-auto hover:bg-(--color-pastel-yellow)">
            Tribute
          </Button>
          <Button
            variant="secondary"
            className="w-full bg-(--color-pastel-purple) text-(--color-deep-purple) font-bold py-1.5 rounded-lg text-[10px] h-auto hover:bg-purple-200"
          >
            Enlist
          </Button>
        </div>
      </div>
    </Link>
  );
}

// --- Search Result Row ---
function CreatorSearchRow({ creator }: { creator: any }) {
  return (
    <Link href={`/${creator.username}`} className="block group">
      <div className="bg-white p-4 flex gap-4 items-center rounded-2xl hover:shadow-md transition-all duration-200 cursor-pointer border border-slate-100/60">
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 relative shrink-0">
          <Image src={creator.avatar} alt="Avatar" fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-slate-900 truncate group-hover:text-(--color-deep-purple) transition-colors flex items-center gap-1">
            {creator.displayName}
            {creator.isVerified && (
              <BadgeCheck
                size={13}
                className="text-(--color-accent-purple) fill-(--color-pastel-purple) shrink-0"
              />
            )}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-bold text-(--color-deep-purple) bg-(--color-pastel-purple) px-2 py-0.5 rounded-full truncate">
              {creator.category}
            </span>
            {creator.isHot && (
              <span className="text-[10px] font-bold text-(--color-deep-purple) bg-(--color-accent-yellow) px-2 py-0.5 rounded-full flex items-center gap-0.5">
                HOT <Flame size={8} fill="currentColor" />
              </span>
            )}
          </div>
          {creator.bio && (
            <p className="text-xs text-slate-400 mt-1.5 line-clamp-1">{creator.bio}</p>
          )}
        </div>
        <Button
          size="sm"
          className="bg-(--color-accent-yellow) text-(--color-deep-purple) font-bold rounded-xl text-xs hover:bg-(--color-pastel-yellow) h-8 px-4 shrink-0"
        >
          Support
        </Button>
      </div>
    </Link>
  );
}

// --- Section Header ---
function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: any;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 px-1">
      <div className="w-9 h-9 rounded-xl bg-(--color-pastel-purple) flex items-center justify-center shrink-0">
        <Icon size={18} className="text-(--color-deep-purple)" />
      </div>
      <div>
        <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
        <p className="text-[11px] text-slate-400 font-medium">{subtitle}</p>
      </div>
    </div>
  );
}

// --- Skeleton Loader ---
function CreatorGridSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col items-center h-[200px] animate-pulse border border-slate-100/60">
      <div className="w-14 h-14 rounded-full bg-slate-200 mb-3" />
      <div className="h-3 w-3/4 bg-slate-200 rounded-full mb-2" />
      <div className="h-2 w-1/2 bg-slate-200 rounded-full mb-4" />
      <div className="w-full space-y-1.5 mt-auto">
        <div className="h-7 w-full bg-slate-200 rounded-lg" />
        <div className="h-7 w-full bg-slate-100 rounded-lg" />
      </div>
    </div>
  );
}

// --- Infinite Scroll Footer ---
function InfiniteScrollIndicator({
  isFetching,
  hasNextPage,
  hasData,
}: {
  isFetching: boolean;
  hasNextPage: boolean;
  hasData: boolean;
}) {
  if (isFetching) {
    return (
      <div className="py-10 flex flex-col items-center justify-center gap-2">
        <Loader2 size={24} className="animate-spin text-(--color-deep-purple)" />
        <span className="text-xs font-medium text-slate-400">Summoning more sovereigns...</span>
      </div>
    );
  }

  if (hasNextPage) {
    return (
      <div className="py-10 flex justify-center">
        <span className="text-xs font-medium text-slate-400">
          Scroll to unveil more of the realm
        </span>
      </div>
    );
  }

  if (hasData) {
    return (
      <div className="py-10 flex justify-center">
        <span className="text-xs font-bold text-slate-400">✨ The realm is fully explored!</span>
      </div>
    );
  }

  return null;
}

// --- Main Content ---
function ExploreContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All Creators"
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const isFirstRender = useRef(true);

  // --- Scroll listener for sticky header effect ---
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Sync URL params with debounced search ---
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearchQuery) {
      params.set("search", debouncedSearchQuery);
    } else {
      params.delete("search");
    }

    if (selectedCategory && selectedCategory !== "All Creators") {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }

    const newQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (newQuery !== currentQuery) {
      router.replace(`${pathname}?${newQuery}`, { scroll: false });
    }
  }, [debouncedSearchQuery, selectedCategory, pathname, router, searchParams]);

  // --- Carousels ---
  const [emblaRef] = useEmblaCarousel({ loop: true, dragFree: true }, [
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  ]);
  const [emblaRefRecommended] = useEmblaCarousel({ loop: true, dragFree: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);

  // --- Infinite scroll ---
  const { ref: inViewRef, inView } = useInView({ threshold: 0.1 });

  // --- Queries ---
  const exploreQuery = useQuery({
    queryKey: ["explore-data"],
    queryFn: () => discoveryService.getExplore(),
    refetchOnWindowFocus: true,
  });

  const creatorsQuery = useInfiniteQuery({
    queryKey: ["creators-data", debouncedSearchQuery, selectedCategory],
    queryFn: ({ pageParam }) =>
      discoveryService.getCreators({
        pageParam: pageParam as number,
        limit: 25,
        search: debouncedSearchQuery,
        category: selectedCategory,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      if (lastPage?.metadata?.page < lastPage?.metadata?.last_page) {
        return lastPage.metadata.page + 1;
      }
      return undefined;
    },
  });

  useEffect(() => {
    if (inView && creatorsQuery.hasNextPage && !creatorsQuery.isFetchingNextPage) {
      creatorsQuery.fetchNextPage();
    }
  }, [
    inView,
    creatorsQuery.hasNextPage,
    creatorsQuery.isFetchingNextPage,
    creatorsQuery.fetchNextPage,
  ]);

  useEffect(() => {
    if (!exploreQuery.isError) return;
    const error = exploreQuery.error as any;
    const errorMessage =
      error?.response?.data?.message || error?.message || "Gagal memuat data explore";
    toast.error(errorMessage);
  }, [exploreQuery.isError, exploreQuery.error]);

  // --- Loading state ---
  if (exploreQuery.isLoading || !exploreQuery.data?.data) {
    return (
      <main className="min-h-screen bg-(--color-off-white) flex items-center justify-center pb-24">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-(--color-deep-purple) border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Pray, wait a moment...</p>
        </div>
      </main>
    );
  }

  // --- Data mapping ---
  const data = exploreQuery.data.data;

  const mapCreator = (c: any) => ({
    id: c.id || c.username,
    username: c.username,
    displayName: c.display_name || c.username,
    role: c.categories?.[0] || "Creator",
    category: c.categories?.[0] || "Creator",
    banner: c.banner_url || "https://i.imgur.com/1Z3MVNG.jpeg",
    avatar: c.avatar_url || "https://i.imgur.com/1Z3MVNG.jpeg",
    bio: c.bio || "",
    isHot: c.is_hot,
    isVerified: c.is_verified,
  });

  const trendingCreators = data.trending_creators?.map(mapCreator) || [];
  const recommendedCreators = data.recommended_creators?.map(mapCreator) || [];
  const categories = data.categories || ["All Creators"];

  const allPaginatedCreators =
    creatorsQuery.data?.pages.flatMap((page: any) => page.data?.map(mapCreator) || []) || [];

  const isSearching = searchQuery.trim().length > 0 || selectedCategory !== "All Creators";

  return (
    <main className="min-h-screen bg-slate-50 relative pb-20">
      {/* Premium Background Pattern */}
      <BGPattern
        variant="grid"
        size={32}
        fill="rgba(0,0,0,0.04)"
        className="fixed inset-0 z-0 pointer-events-none"
      />

      {/* Decorative Glowing Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-(--color-pastel-purple) mix-blend-multiply blur-[120px] opacity-40 z-0 pointer-events-none"></div>
      <div className="fixed bottom-[10%] right-[-10%] w-[50%] h-[60%] rounded-full bg-(--color-pastel-yellow) mix-blend-multiply blur-[120px] opacity-30 z-0 pointer-events-none"></div>

      <div className="relative z-10">
        <div
          className={`
        sticky top-[58px] sm:top-[64px] z-40 transition-all duration-300
        ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-slate-100/80 shadow-sm py-1"
            : "bg-transparent border-b border-transparent py-2"
        }
      `}
        >
          <div className="max-w-7xl mx-auto">
            {/* Search Input */}
            <div className="px-4 sm:px-6 py-3">
              <div className="relative group max-w-2xl mx-auto">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-(--color-deep-purple) transition-colors">
                  {creatorsQuery.isFetching ? (
                    <Loader2 size={18} className="animate-spin text-(--color-deep-purple)" />
                  ) : (
                    <Search size={18} />
                  )}
                </div>
                <input
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-2.5 pl-11 pr-10 text-sm focus:ring-2 focus:ring-(--color-pastel-purple) focus:border-(--color-accent-purple) transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400"
                  placeholder="Search for a sovereign..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
                  >
                    <X size={12} className="text-slate-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Pills */}
            <div className="px-4 sm:px-6 pb-3">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide py-0.5 max-w-2xl mx-auto">
                {categories.map((cat: string) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                      selectedCategory === cat
                        ? "bg-(--color-accent-yellow) text-(--color-deep-purple) shadow-sm"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {cat === "All Creators" ? "The Entire Realm" : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 mt-6">
          {!isSearching ? (
            <>
              {/* Trending Carousel */}
              <section>
                <SectionHeader
                  icon={TrendingUp}
                  title="Trending Sovereigns"
                  subtitle="The most favored this week 🔥"
                />
                <div
                  ref={emblaRef}
                  className="overflow-hidden mt-4 cursor-grab active:cursor-grabbing"
                >
                  <div className="flex -ml-4">
                    {trendingCreators.map((creator: any, idx: number) => (
                      <CreatorCard key={idx} creator={creator} />
                    ))}
                  </div>
                </div>
              </section>

              {/* Recommended Carousel */}
              {recommendedCreators.length > 0 && (
                <section>
                  <SectionHeader
                    icon={Sparkles}
                    title="Appointed for Thee"
                    subtitle="Tailored to thy noble tastes"
                  />
                  <div
                    ref={emblaRefRecommended}
                    className="overflow-hidden mt-4 cursor-grab active:cursor-grabbing"
                  >
                    <div className="flex -ml-4">
                      {recommendedCreators.map((creator: any, idx: number) => (
                        <CreatorCard key={idx} creator={creator} />
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* All Creators Grid */}
              <section>
                <SectionHeader
                  icon={Users}
                  title="The Entire Realm"
                  subtitle="Seek new alliances"
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-4">
                  {creatorsQuery.isLoading
                    ? Array.from({ length: 10 }).map((_, idx) => (
                        <CreatorGridSkeleton key={`skeleton-${idx}`} />
                      ))
                    : allPaginatedCreators.map((creator: any, idx: number) => (
                        <CreatorGridCard key={`all-${creator.id}-${idx}`} creator={creator} />
                      ))}
                </div>

                <div ref={inViewRef}>
                  <InfiniteScrollIndicator
                    isFetching={creatorsQuery.isFetchingNextPage || creatorsQuery.isLoading}
                    hasNextPage={!!creatorsQuery.hasNextPage}
                    hasData={allPaginatedCreators.length > 0}
                  />
                </div>
              </section>
            </>
          ) : (
            /* Search Results */
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    {debouncedSearchQuery
                      ? `Decree results for "${debouncedSearchQuery}"`
                      : `Order: ${selectedCategory}`}
                  </h2>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {allPaginatedCreators.length} sovereigns found
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("The Entire Realm");
                  }}
                  className="text-xs font-bold text-(--color-deep-purple) bg-(--color-pastel-purple) hover:bg-purple-200 px-4 py-2 rounded-full transition-colors"
                >
                  Clear Decree
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {creatorsQuery.isLoading
                  ? Array.from({ length: 6 }).map((_, idx) => (
                      <div
                        key={`search-skeleton-${idx}`}
                        className="bg-white rounded-2xl p-4 flex gap-4 items-center animate-pulse border border-slate-100/60"
                      >
                        <div className="w-14 h-14 rounded-xl bg-slate-200 shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-2/3 bg-slate-200 rounded-full" />
                          <div className="h-2 w-1/3 bg-slate-200 rounded-full" />
                          <div className="h-2 w-full bg-slate-100 rounded-full" />
                        </div>
                      </div>
                    ))
                  : allPaginatedCreators.map((creator: any, idx: number) => (
                      <CreatorSearchRow key={`search-${creator.id}-${idx}`} creator={creator} />
                    ))}
              </div>

              {allPaginatedCreators.length === 0 && !creatorsQuery.isLoading && (
                <div className="text-center py-16">
                  <Search size={40} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 font-medium">
                    No Sovereigns match thy decree
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Attempt another search or order</p>
                </div>
              )}

              <div ref={inViewRef}>
                <InfiniteScrollIndicator
                  isFetching={creatorsQuery.isFetchingNextPage || creatorsQuery.isLoading}
                  hasNextPage={!!creatorsQuery.hasNextPage}
                  hasData={allPaginatedCreators.length > 0}
                />
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-(--color-off-white) flex items-center justify-center pb-24">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-(--color-deep-purple) border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 font-medium">Pray, wait a moment...</p>
          </div>
        </main>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
