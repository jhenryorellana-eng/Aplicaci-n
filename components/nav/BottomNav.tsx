"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Library, User } from "lucide-react";
import { ROUTES } from "@/lib/constants";

const ITEMS = [
  { href: ROUTES.feed, label: "Feed", icon: Flame },
  { href: ROUTES.catalog, label: "Catálogo", icon: Library },
  { href: ROUTES.login, label: "Cuenta", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/80 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-2.5 text-[0.7rem] font-semibold transition-colors ${
                  active ? "text-gold" : "text-faint hover:text-muted"
                }`}
              >
                <Icon
                  className="size-6"
                  strokeWidth={active ? 2.4 : 2}
                  aria-hidden
                />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
