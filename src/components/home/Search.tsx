"use client";

import * as React from "react";
import {
  Calculator,
  Calendar,
  CreditCard,
  Search,
  Settings,
  Smile,
  User,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { search as searchPosts } from "@/lib/algolia";
import { Button } from "../ui/button";
import { Webtoon } from "@prisma/client";

export function SearchBar() {
  const [open, setOpen] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<Webtoon[]>([]);

  async function searchAlgolia(query: string) {
    if (query.length > 0) {
      const results = await searchPosts(query);
      console.log("Algolia search results:", results);

      // Inspect the structure of the first result if available
      if (results && results.length > 0) {
        console.log("First result structure:", Object.keys(results[0]));

        // Check if there's a 'hits' property or if we need to access the results differently
        if ("hits" in results) {
          // If results has a hits property, use that
          const hits = (results as any).hits;

          // Transform hits into the Webtoon type
          const transformedResults = hits.map(
            (hit: any) =>
              ({
                id: hit.objectID || hit.id,
                createdAt: hit.createdAt,
                updatedAt: hit.updatedAt,
                title: hit.title,
                description: hit.description,
                author: hit.author,
                coverImage: hit.coverImage,
                status: hit.status,
              } as unknown as Webtoon)
          );

          setSearchResults(transformedResults);
        } else {
          // Try to access the fields directly from the results array
          // assuming each result already has the needed properties
          try {
            const transformedResults = (results as any[]).map((result) => {
              // If result has an '_highlightResult' or similar property with actual data
              const data = result._highlightResult ? result : result;

              return {
                id: data.objectID || data.id || "unknown",
                createdAt: data.createdAt || new Date().toISOString(),
                updatedAt: data.updatedAt || new Date().toISOString(),
                title: data.title || "Untitled",
                description: data.description || "",
                author: data.author || "Unknown",
                coverImage: data.coverImage || "",
                status: data.status || "unknown",
              } as unknown as Webtoon;
            });

            setSearchResults(transformedResults);
          } catch (error) {
            console.error("Error transforming search results:", error);
            setSearchResults([]);
          }
        }
      } else {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  }

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant={"ghost"}
        onClick={() => {
          setOpen(true);
        }}
      >
        <Search className="block md:hidden h-6 w-6 sm:h-5 sm:w-5 md:h-4 md:w-4" />
        <span className="flex-grow text-left text-base sm:text-sm font-normal hidden md:block">
          Rechercher
        </span>
        <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          onValueChange={searchAlgolia}
          placeholder="Rechercher..."
          className="p-2 sm:p-3 md:p-4"
        />
        <CommandList className="max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] overflow-y-auto p-2 sm:p-3">
          <CommandEmpty>No results found.</CommandEmpty>
          {searchResults.map((result) => (
            <CommandItem key={result.id}>
              <span>{result.title || result.id}</span>
            </CommandItem>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
