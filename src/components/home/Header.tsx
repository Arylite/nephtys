"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { buttonVariants } from "../ui/button";
import { Menu, Shield, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { Session } from "@/types/better-auth";
import { useCallback, useEffect, useState, memo } from "react";
import { SearchBar } from "./Search";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const links = [
  {
    name: "Accueil",
    href: "/",
  },
  {
    name: "Webtoons",
    href: "/webtoons",
  },
  {
    name: "Discord",
    href: "https://discord.com/invite/URL_ADDRESS",
  },
  {
    name: "Nous supporter",
    href: "/donate",
  },
] as const;

// Desktop Navigation
const Navigation = memo(() => (
  <nav className="hidden md:flex items-center gap-4">
    {links.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className={buttonVariants({ variant: "ghost" })}
      >
        {link.name}
      </Link>
    ))}
  </nav>
));
Navigation.displayName = "Navigation";

// Mobile Navigation
const MobileNav = ({
  session,
  onSignOut,
}: {
  session: Session | null;
  onSignOut: () => void;
}) => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-5 w-5" />
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="w-[280px] sm:w-[350px] p-0">
      <SheetHeader className="p-6 border-b">
        <SheetTitle className="text-xl font-semibold">Nephtys Scan</SheetTitle>
      </SheetHeader>

      <div className="flex flex-col h-full">
        {session && (
          <div className="px-6 py-4 border-b">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={session.user.image || ""}
                  alt={session.user.name}
                />
                <AvatarFallback>{session.user.name}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-none mb-1 truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        <nav className="px-3 py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center h-11 px-4 rounded-md text-sm font-medium transition-colors hover:bg-accent"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t">
          <div className="px-3 py-4">
            {session ? (
              <>
                <p className="px-4 text-xs font-medium text-muted-foreground mb-3">
                  Compte
                </p>
                <Link
                  href="/profile"
                  className="flex items-center h-11 px-4 rounded-md text-sm font-medium transition-colors hover:bg-accent"
                >
                  Profil
                </Link>
                <Link
                  href="/profile/bookmarks"
                  className="flex items-center h-11 px-4 rounded-md text-sm font-medium transition-colors hover:bg-accent"
                >
                  Favoris
                </Link>
                <Link
                  href="/profile/reading-history"
                  className="flex items-center h-11 px-4 rounded-md text-sm font-medium transition-colors hover:bg-accent"
                >
                  Historique de lecture
                </Link>
                <Link
                  href="/profile/settings"
                  className="flex items-center h-11 px-4 rounded-md text-sm font-medium transition-colors hover:bg-accent"
                >
                  Paramètres
                </Link>
                <button
                  onClick={onSignOut}
                  className="w-full flex items-center h-11 px-4 rounded-md text-sm font-medium text-red-600 transition-colors hover:bg-accent"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="flex items-center h-11 px-4 rounded-md text-sm font-medium transition-colors hover:bg-accent"
                >
                  Se connecter
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex items-center h-11 px-4 rounded-md text-sm font-medium transition-colors hover:bg-accent"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
);

export const Header = () => {
  const [session, setSession] = useState<Session | null>(null);

  const getSession = useCallback(async () => {
    try {
      const sessionData = await authClient.getSession();
      setSession(sessionData.data);
    } catch (error) {
      console.error("Échec de la récupération de la session:", error);
    }
  }, []);

  useEffect(() => {
    getSession();
  }, [getSession]);

  const handleSignOut = useCallback(async () => {
    try {
      await authClient.signOut();
      setSession(null);
    } catch (error) {
      console.error("Échec de la déconnexion:", error);
    }
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3 md:gap-5">
          <MobileNav session={session} onSignOut={handleSignOut} />
          <Link href="/" className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-semibold">
              Nephtys Scan
            </span>
          </Link>
          <Navigation />
        </div>

        <div className="flex items-center gap-2">
          <SearchBar />
          <ModeToggle />
          {session?.user.role === "admin" ? (
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <Shield />
              </Button>
            </Link>
          ) : null}
          <div className="hidden md:block">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-5 w-5 sm:h-10 sm:w-10 cursor-pointer">
                    <AvatarImage
                      src={session.user.image || ""}
                      alt={session.user.name}
                    />
                    <AvatarFallback>{session.user.name}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm font-medium leading-none">
                        {session.user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/profile">
                    <DropdownMenuItem>Profil</DropdownMenuItem>
                  </Link>
                  <Link href="/profile/bookmarks">
                    <DropdownMenuItem>Favoris</DropdownMenuItem>
                  </Link>
                  <Link href="/profile/reading-history">
                    <DropdownMenuItem>Historique de lecture</DropdownMenuItem>
                  </Link>
                  {session.user.role === "admin" && (
                    <>
                      <DropdownMenuSeparator />
                      <Link href="/dashboard">
                        <DropdownMenuItem>Tableau de bord</DropdownMenuItem>
                      </Link>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <Link href="/profile/settings">
                    <DropdownMenuItem>Paramètres</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={handleSignOut}
                  >
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/auth/signin"
                  className={buttonVariants({ variant: "ghost" })}
                >
                  Se connecter
                </Link>
                <Link
                  href="/auth/signup"
                  className={buttonVariants({ variant: "ghost" })}
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
