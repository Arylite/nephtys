"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Category = {
  name: string;
  slug: string;
  icon: React.ReactNode;
};

// This is a static list of categories since we don't have a categories API endpoint
const categories = [
  { name: "Action", slug: "action" },
  { name: "Aventure", slug: "aventure" },
  { name: "Comédie", slug: "comedie" },
  { name: "Drame", slug: "drame" },
  { name: "Fantasy", slug: "fantasy" },
  { name: "Horreur", slug: "horreur" },
  { name: "Romance", slug: "romance" },
  { name: "Sci-Fi", slug: "sci-fi" },
];

export function Categories() {
  return (
    <section className="py-8 md:py-12">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Catégories
          </h2>
          <Link href="/categories">
            <Button variant="ghost" className="gap-1 group hover:bg-primary/10">
              Voir tout{" "}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="block"
            >
              <Card className="hover:bg-accent/50 transition-colors h-full">
                <CardContent className="flex items-center justify-center p-6 h-full">
                  <span className="text-lg font-medium">{category.name}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}