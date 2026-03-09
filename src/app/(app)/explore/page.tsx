"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import toast from "react-hot-toast";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { discoveryService } from "@/services/discovery";
import { useDebounce } from "@/hooks/use-debounce";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Search,
  Flame,
  BadgeCheck,
  Palette,
  Music,
  Video,
  Paintbrush,
  Flag,
  Check,
} from "lucide-react";

function ExploreContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All Creators"
  );
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const isFirstRender = useRef(true);

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
  const [emblaRef] = useEmblaCarousel({ loop: true, dragFree: true }, [
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  ]);
  const [emblaRefRecommended] = useEmblaCarousel({ loop: true, dragFree: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);

  const { ref: inViewRef, inView } = useInView({ threshold: 0.1 });

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

  if (exploreQuery.isLoading || !exploreQuery.data?.data) {
    return (
      <main className="min-h-screen bg-[var(--color-off-white)] flex items-center justify-center pb-24">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[var(--color-deep-purple)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Bentar ya...</p>
        </div>
      </main>
    );
  }

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
    borderColor: "border-[var(--color-pastel-purple)]",
    bgColor: "bg-purple-50",
    icon: <Palette className="text-[var(--color-deep-purple)]" size={32} />,
  });

  const trendingCreators = data.trending_creators?.map(mapCreator) || [];
  const recommendedCreators = data.recommended_creators?.map(mapCreator) || [];
  const categories = data.categories || ["All Creators"];

  const allPaginatedCreators =
    creatorsQuery.data?.pages.flatMap((page: any) => page.data?.map(mapCreator) || []) || [];

  const isSearching = searchQuery.trim().length > 0 || selectedCategory !== "All Creators";

  const filteredCreators = allPaginatedCreators;

  return (
    <main className="min-h-screen bg-[var(--color-off-white)] pb-24">
      <div className="mx-auto space-y-6">
        {/* Search Header (Sticky) */}
        <div className="sticky top-[69px] z-40 backdrop-blur-xl border-b border-slate-100">
          {/* Search Input */}
          <div className="px-6 py-2">
            <div className="relative group w-full">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--color-deep-purple)] transition-colors"
                size={20}
              />
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
          <div className="px-6 pb-4 pt-2">
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 -my-1">
              {categories.map((cat: string) => (
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
          </div>
        </div>

        <div className="max-w-7xl mx-auto space-y-6">
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
                    <span className="text-xs font-bold text-[var(--color-deep-purple)]">
                      View all
                    </span>
                  </Link>
                </div>

                <div
                  ref={emblaRef}
                  className="overflow-hidden mx-6 pb-6 cursor-grab active:cursor-grabbing"
                >
                  <div className="flex -ml-4">
                    {trendingCreators.map((creator: any, idx: number) => (
                      <Link
                        href={`/${creator.username}`}
                        key={idx}
                        className="block group flex-[0_0_auto] pl-4"
                        draggable={false}
                      >
                        <div className="bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.02),0_8px_10px_-6px_rgba(0,0,0,0.02)] rounded-[24px] min-w-[280px] w-[280px] overflow-hidden flex flex-col cursor-pointer transition-transform hover:scale-[1.02]">
                          <div className="h-32 relative">
                            <Image
                              src={creator.banner}
                              alt="Banner"
                              fill
                              className="object-cover"
                              draggable={false}
                              onDragStart={(e) => e.preventDefault()}
                            />
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
                                  <Image
                                    src={creator.avatar}
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                    draggable={false}
                                    onDragStart={(e) => e.preventDefault()}
                                  />
                                </div>
                                <div>
                                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-[var(--color-deep-purple)] transition-colors flex items-center gap-1">
                                    {creator.displayName}
                                    {creator.isVerified && (
                                      <BadgeCheck
                                        size={14}
                                        className="text-[var(--color-accent-purple)] fill-[var(--color-pastel-purple)]"
                                      />
                                    )}
                                  </h3>
                                  <p className="text-[11px] text-slate-500">{creator.role}</p>
                                </div>
                              </div>
                            </div>
                            <p className="mt-3 text-xs text-slate-600 line-clamp-1 italic">
                              "{creator.bio}"
                            </p>
                            <div className="mt-4 flex gap-2">
                              <Button className="flex-1 bg-[var(--color-accent-yellow)] text-[var(--color-deep-purple)] font-bold py-2.5 rounded-xl text-xs hover:bg-[var(--color-pastel-yellow)]">
                                Support
                              </Button>
                              <Button
                                variant="secondary"
                                className="px-3 bg-[var(--color-pastel-purple)] text-[var(--color-deep-purple)] font-bold py-2.5 rounded-xl text-xs hover:bg-purple-200"
                              >
                                Follow
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>

              {/* Recommended Section */}
              <section className="mt-4 px-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">Recommended for You</h2>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Based on your interests
                    </p>
                  </div>
                </div>

                <div
                  ref={emblaRefRecommended}
                  className="overflow-hidden mx-6 pb-6 cursor-grab active:cursor-grabbing"
                >
                  <div className="flex -ml-4">
                    {recommendedCreators.map((creator: any, idx: number) => (
                      <Link
                        href={`/${creator.username}`}
                        key={idx}
                        className="block group flex-[0_0_auto] pl-4"
                        draggable={false}
                      >
                        <div className="bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.02),0_8px_10px_-6px_rgba(0,0,0,0.02)] rounded-[24px] min-w-[280px] w-[280px] overflow-hidden flex flex-col cursor-pointer transition-transform hover:scale-[1.02]">
                          <div className="h-32 relative">
                            <Image
                              src={creator.banner}
                              alt="Banner"
                              fill
                              className="object-cover"
                              draggable={false}
                              onDragStart={(e) => e.preventDefault()}
                            />
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
                                  {creator.avatar ? (
                                    <Image
                                      src={creator.avatar}
                                      alt="Avatar"
                                      fill
                                      className="object-cover"
                                      draggable={false}
                                      onDragStart={(e) => e.preventDefault()}
                                    />
                                  ) : (
                                    <div
                                      className={`w-full h-full flex items-center justify-center ${creator.bgColor}`}
                                    >
                                      {creator.icon}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-[var(--color-deep-purple)] transition-colors flex items-center gap-1">
                                    {creator.displayName}
                                  </h3>
                                  <p className="text-[11px] text-slate-500">{creator.role}</p>
                                </div>
                              </div>
                            </div>
                            <p className="mt-3 text-xs text-slate-600 line-clamp-1 italic">
                              "{creator.bio}"
                            </p>
                            <div className="mt-4 flex gap-2">
                              <Button className="flex-1 bg-[var(--color-accent-yellow)] text-[var(--color-deep-purple)] font-bold py-2.5 rounded-xl text-xs hover:bg-[var(--color-pastel-yellow)]">
                                Support
                              </Button>
                              <Button
                                variant="secondary"
                                className="px-3 bg-[var(--color-pastel-purple)] text-[var(--color-deep-purple)] font-bold py-2.5 rounded-xl text-xs hover:bg-purple-200"
                              >
                                Follow
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>

              {/* All Creators Section (Infinite Scroll) */}
              <section className="pt-8 px-6 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">All Creators</h2>
                    <p className="text-[11px] text-slate-400 font-medium">Discover new talent</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {creatorsQuery.isLoading
                    ? Array.from({ length: 10 }).map((_, idx) => (
                        <div
                          key={`loader-${idx}`}
                          className="bg-white shadow-sm border border-slate-100/50 rounded-[24px] p-4 flex flex-col items-center h-[200px] animate-pulse"
                        >
                          <div className="w-16 h-16 rounded-full bg-slate-200 mb-4"></div>
                          <div className="h-3 w-3/4 bg-slate-200 rounded-full mb-3"></div>
                          <div className="h-2 w-1/2 bg-slate-200 rounded-full mb-6"></div>
                          <div className="w-full space-y-2 mt-auto">
                            <div className="h-8 w-full bg-slate-200 rounded-lg"></div>
                            <div className="h-8 w-full bg-slate-200 rounded-lg"></div>
                          </div>
                        </div>
                      ))
                    : allPaginatedCreators.map((creator: any, idx: number) => (
                        <Link
                          href={`/${creator.username}`}
                          key={`all-${creator.id}-${idx}`}
                          className="block group"
                        >
                          <div className="bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.02),0_8px_10px_-6px_rgba(0,0,0,0.02)] rounded-[24px] p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-all h-full">
                            <div className="relative mb-3">
                              {creator.avatar ? (
                                <div className="w-16 h-16 rounded-full border-2 border-[var(--color-pastel-purple)] overflow-hidden relative">
                                  <Image
                                    src={creator.avatar}
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div
                                  className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${creator.borderColor} ${creator.bgColor}`}
                                >
                                  {creator.icon}
                                </div>
                              )}
                              {creator.isHot && (
                                <div className="absolute -bottom-1 -right-1 bg-green-400 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                                  <Flame size={10} className="text-white" fill="currentColor" />
                                </div>
                              )}
                            </div>
                            <h3 className="font-bold text-xs text-slate-900 group-hover:text-[var(--color-deep-purple)] transition-colors line-clamp-1 break-all flex items-center gap-1 justify-center">
                              {creator.displayName}
                            </h3>
                            <p className="text-[10px] text-slate-400 mt-1 mb-4">{creator.role}</p>
                            <div className="w-full space-y-2 mt-auto">
                              <Button className="w-full bg-[var(--color-accent-yellow)] text-[var(--color-deep-purple)] font-bold py-2 rounded-lg text-[10px] h-auto hover:bg-[var(--color-pastel-yellow)]">
                                Support
                              </Button>
                              <Button
                                variant="secondary"
                                className="w-full bg-[var(--color-pastel-purple)] text-[var(--color-deep-purple)] font-bold py-2 rounded-lg text-[10px] h-auto hover:bg-purple-200"
                              >
                                Follow
                              </Button>
                            </div>
                          </div>
                        </Link>
                      ))}
                </div>

                {/* Loader Indicator for Infinite Scroll */}
                <div
                  ref={inViewRef}
                  className="py-12 flex flex-col items-center justify-center gap-3"
                >
                  {creatorsQuery.isFetchingNextPage || creatorsQuery.isLoading ? (
                    <>
                      <div className="w-8 h-8 border-4 border-slate-200 border-t-[var(--color-deep-purple)] rounded-full animate-spin"></div>
                      <span className="text-xs font-bold text-slate-400">
                        Loading more creators...
                      </span>
                    </>
                  ) : creatorsQuery.hasNextPage ? (
                    <span className="text-xs font-bold text-slate-400">Scroll down for more</span>
                  ) : (
                    <span className="text-xs font-bold text-slate-400">
                      ✨ You've reached the end!
                    </span>
                  )}
                </div>
              </section>
            </>
          ) : (
            /* Search Results View */
            <div className="px-4 mt-4 space-y-6">
              {/* Results Grid - Using Design 3 List Style for Search Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCreators.map((creator: any, idx: number) => (
                  <Link href={`/${creator.username}`} key={idx} className="block group">
                    <Card className="p-4 flex gap-4 items-center border-none shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04),0_2px_8px_-1px_rgba(0,0,0,0.02)] rounded-[20px] hover:shadow-md transition-shadow cursor-pointer">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 relative">
                          {creator.avatar ? (
                            <Image
                              src={creator.avatar}
                              alt="Avatar"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            creator.icon
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="pr-2 flex-1 min-w-0">
                            <h3 className="font-extrabold text-sm text-slate-900 truncate group-hover:text-[var(--color-deep-purple)] transition-colors flex items-center gap-1">
                              {creator.displayName}
                            </h3>
                            <span className="text-[10px] font-bold text-[var(--color-deep-purple)] bg-[var(--color-pastel-purple)] px-2 py-0.5 rounded-full inline-block mt-0.5 truncate max-w-full">
                              {creator.category || creator.role}
                            </span>
                          </div>
                          <div className="bg-[var(--color-pastel-yellow)] hover:bg-[var(--color-accent-yellow)] text-[var(--color-deep-purple)] px-4 py-1.5 rounded-full text-[10px] font-bold transition-colors whitespace-nowrap">
                            Support
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-1 italic">
                          {creator.bio || "No bio available"}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}

                {filteredCreators.length === 0 && !creatorsQuery.isLoading && (
                  <div className="text-center py-10 text-slate-400 col-span-full">
                    <p>No creators found matching your criteria.</p>
                  </div>
                )}
              </div>

              {/* In-View triggers pagination in search view too */}
              <div
                ref={inViewRef}
                className="py-12 flex flex-col items-center justify-center gap-3"
              >
                {creatorsQuery.isFetchingNextPage || creatorsQuery.isLoading ? (
                  <>
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-[var(--color-deep-purple)] rounded-full animate-spin"></div>
                    <span className="text-xs font-bold text-slate-400">
                      Loading more results...
                    </span>
                  </>
                ) : creatorsQuery.hasNextPage ? (
                  <span className="text-xs font-bold text-slate-400">Scroll down for more</span>
                ) : filteredCreators.length > 0 ? (
                  <span className="text-xs font-bold text-slate-400">
                    ✨ You've reached the end!
                  </span>
                ) : null}
              </div>
            </div>
          )}
        </div>
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

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[var(--color-off-white)] flex items-center justify-center pb-24">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-[var(--color-deep-purple)] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Bentar ya...</p>
          </div>
        </main>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
