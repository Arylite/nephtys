"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store";
import {
  fetchLatestWebtoons,
  selectLatestWebtoons,
} from "@/store/slices/webtoonSlice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

export function LatestReleases() {
  const dispatch = useDispatch<AppDispatch>();
  const latestWebtoons = useSelector(selectLatestWebtoons);
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  // Media queries for responsive design
  const isMobile = useMediaQuery("(max-width: 639px)");
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    dispatch(fetchLatestWebtoons());
  }, [dispatch]);

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);

    // Cleanup
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  // Determine how many items would fill a row based on screen size
  const minItemsToFill = useMemo(() => {
    // Default to 4 items per row on desktop
    return 4;
  }, []);

  // Check if we need to add a "See more" card
  const shouldShowSeeMore =
    latestWebtoons.length > 0 && latestWebtoons.length < minItemsToFill;

  // Calculate total number of items (including "See more" card if present)
  const totalItems = shouldShowSeeMore
    ? latestWebtoons.length + 1
    : latestWebtoons.length;

  // Determine if navigation arrows should be shown based on screen size and item count
  const showNavigation = useMemo(() => {
    if (totalItems <= 1) return false;

    if (isMobile) return totalItems > 1;
    if (isTablet) return totalItems > 2;
    if (isDesktop) return totalItems > 4;

    return true; // Default fallback
  }, [totalItems, isMobile, isTablet, isDesktop]);

  // Only show dots on mobile and if there are multiple items
  const showDots = isMobile && totalItems > 1;

  return (
    <section className="py-8 md:py-10 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-3 md:px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Dernières sorties
          </h2>
          <Link href="/webtoons">
            <Button variant="ghost" className="gap-1 group hover:bg-primary/10">
              Voir tout{" "}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {latestWebtoons.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="p-2">
                  <Card className="py-0 rounded-lg overflow-hidden border border-muted-foreground/10 bg-card/50 backdrop-blur-sm">
                    <div className="relative aspect-[2/3] max-h-48 md:max-h-56">
                      <Skeleton className="h-full w-full absolute rounded-t-lg" />
                    </div>
                  </Card>
                </div>
              ))}
          </div>
        ) : (
          <div className="relative px-4">
            <Carousel opts={{ align: "start", loop: true }} setApi={setApi}>
              <CarouselContent className="-ml-6">
                {latestWebtoons.map((webtoon) => (
                  <CarouselItem
                    key={webtoon.id}
                    className={cn(
                      "pl-6 basis-full sm:basis-1/2",
                      latestWebtoons.length <= 2
                        ? "md:basis-1/2"
                        : latestWebtoons.length <= 4
                        ? "md:basis-1/3"
                        : "md:basis-1/4"
                    )}
                  >
                    <div className="p-2">
                      <Link
                        href={`/webtoons/${webtoon.id}`}
                        className="block group w-full"
                      >
                        <Card className="py-0 rounded-lg overflow-hidden relative w-full transition-all duration-200 border border-muted-foreground/10 group-hover:ring-2 group-hover:ring-primary/70">
                          <div className="relative aspect-[2/3] max-h-48 md:max-h-56">
                            {webtoon.coverImage ? (
                              <>
                                <Image
                                  src={webtoon.coverImage || "/placeholder.svg"}
                                  alt={webtoon.title}
                                  fill
                                  className="object-cover rounded-t-lg"
                                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-5 transition-opacity duration-300 group-hover:opacity-95 rounded-t-lg">
                                  <h3 className="font-semibold line-clamp-1 text-lg text-white mb-0.5 ">
                                    {webtoon.title}
                                  </h3>
                                  <p className="text-sm text-white/80">
                                    {webtoon.author}
                                  </p>
                                </div>
                              </>
                            ) : (
                              <div className="bg-secondary h-full w-full flex items-center justify-center rounded-t-lg">
                                <span className="text-secondary-foreground text-sm">
                                  No Image
                                </span>
                              </div>
                            )}
                          </div>
                        </Card>
                      </Link>
                    </div>
                  </CarouselItem>
                ))}

                {shouldShowSeeMore && (
                  <CarouselItem
                    className={cn(
                      "pl-6 basis-full sm:basis-1/2",
                      latestWebtoons.length <= 2
                        ? "md:basis-1/2"
                        : "md:basis-1/3"
                    )}
                  >
                    <div className="p-2">
                      <Link
                        href="/webtoons"
                        className="block group w-full h-full"
                      >
                        <Card className="py-0 rounded-lg overflow-hidden relative w-full transition-all duration-200 border border-primary/30 bg-gradient-to-br from-muted/80 to-primary/10 group-hover:ring-2 group-hover:ring-primary/70">
                          <div className="relative aspect-[2/3] max-h-48 md:max-h-56 w-full flex flex-col items-center justify-center p-4 text-center">
                            <div className="size-14 rounded-full bg-primary/20 flex items-center justify-center mb-3 group-hover:bg-primary/30 transition-colors">
                              <ArrowRight className="size-6 text-primary" />
                            </div>
                            <h3 className="font-semibold text-base text-primary mb-2">
                              Voir plus de webtoons
                            </h3>
                            <div className="flex flex-wrap justify-center gap-1 mt-1">
                              {Array(3)
                                .fill(0)
                                .map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-2 h-2 rounded-full bg-primary/60"
                                  />
                                ))}
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>

              {showNavigation && (
                <>
                  <CarouselPrevious className="-left-4 md:-left-6 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/10 hover:text-primary lg:block hidden" />
                  <CarouselNext className="-right-4 md:-right-6 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/10 hover:text-primary lg:block hidden" />
                </>
              )}
            </Carousel>

            {/* Navigation dots for mobile */}
            {showDots && (
              <div className="flex justify-center mt-4 gap-1.5">
                {Array.from({ length: totalItems }).map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      current === index
                        ? "bg-primary w-4"
                        : "bg-primary/30 hover:bg-primary/50"
                    )}
                    onClick={() => api?.scrollTo(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
