"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Hero() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function setup() {
      const storage = localStorage.getItem("heroShow");
      if (storage === null) {
        setShow(true);
        localStorage.setItem("heroShow", "true");
      } else {
        setShow(false);
      }
    }
  }, []);

  function handleClose() {
    setShow(false);
    localStorage.setItem("heroShow", "false");
  }

  return (
    <section
      className={cn(
        `py-12 md:py-20 bg-gradient-to-b from-background to-muted`,
        show ? "hidden" : "block"
      )}
    >
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Découvrez les meilleurs webtoons
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Nephtys Scans vous propose une large sélection de webtoons traduits
            en français. Parcourez notre collection et trouvez votre prochaine
            lecture préférée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/webtoons">
              <Button size="lg" className="w-full sm:w-auto">
                Explorer les webtoons
              </Button>
            </Link>
            <Link href="/categories">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Parcourir les catégories
              </Button>
            </Link>
          </div>
          {/* <Button
            size="sm"
            variant="ghost"
            className="w-full sm:w-auto"
            onClick={handleClose}
          >
            Cacher
          </Button> */}
        </div>
      </div>
    </section>
  );
}
