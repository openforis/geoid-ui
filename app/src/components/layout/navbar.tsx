"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
// import { LogOut, MapPin, Moon, Settings, Sun, User } from "lucide-react";
import { BookOpen, LogOut, Moon, Settings, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/components/layout/theme-provider";
import { SignInButton } from "@/components/layout/sign-in-button";

const ACCOUNT_LINKS: { icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>; href: string; label: string }[] = [
  // { icon: MapPin, href: "/my-geoids", label: "My GeoIDs" },
];

export function Navbar({
  accountManagementUrl,
  apiDocsUrl,
}: {
  accountManagementUrl?: string | null;
  apiDocsUrl?: string | null;
}) {
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMenuToggle = () => setOpen((v) => !v);

  const handleOutsideClick = (e: React.FocusEvent | React.MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.relatedTarget as Node)) {
      setOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-[250] flex h-14 items-center gap-4 border-b border-border bg-bg px-8">
      <Link href="/" className="flex shrink-0 items-center no-underline">
        <Image
          src={theme === "dark" ? "/geoid_logo_nav_white.svg" : "/geoid_logo_nav.svg"}
          alt="GeoID"
          width={102}
          height={32}
          className="h-8 w-auto"
          priority
        />
      </Link>

      <div className="flex-1" />

      <TooltipProvider>
        {apiDocsUrl && (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  nativeButton={false}
                  render={<a href={apiDocsUrl} target="_blank" rel="noopener noreferrer" aria-label="API docs" />}
                />
              }
            >
              <BookOpen className="size-4" />
            </TooltipTrigger>
            <TooltipContent>API docs</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                nativeButton={false}
                render={
                  <a href="https://github.com/openforis/geoid-ui" target="_blank" rel="noopener noreferrer" aria-label="GitHub" />
                }
              />
            }
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
          </TooltipTrigger>
          <TooltipContent>GitHub</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={<Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" />}>
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </TooltipTrigger>
          <TooltipContent>Toggle theme</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {session?.user ? (
        <div className="relative" ref={menuRef} onBlur={handleOutsideClick}>
          <button
            onClick={handleMenuToggle}
            aria-expanded={open}
            aria-haspopup="menu"
            aria-label="User menu"
            className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-border bg-surface-raised text-text-primary transition-colors hover:border-accent-green"
          >
            {session.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element -- external IdP avatar host is unknown, can't be whitelisted in next.config
              <img
                src={session.user.image}
                alt=""
                width={36}
                height={36}
                className="size-full rounded-full object-cover"
              />
            ) : (
              <User className="size-4" />
            )}
          </button>

          {open && (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+8px)] z-[250] min-w-44 rounded-lg border border-border bg-surface py-1 shadow-md"
            >
              {(session.user.email ?? session.user.name) && (
                <p className="truncate border-b border-border px-4 py-2 text-xs text-text-muted">
                  {session.user.email ?? session.user.name}
                </p>
              )}

              {ACCOUNT_LINKS.map(({ icon: Icon, href, label }) => (
                <Link
                  key={href}
                  href={href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:bg-surface-raised hover:text-text-primary transition-colors"
                >
                  <Icon className="size-3.5" aria-hidden />
                  {label}
                </Link>
              ))}

              {accountManagementUrl && (
                <a
                  href={accountManagementUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:bg-surface-raised hover:text-text-primary transition-colors"
                >
                  <Settings className="size-3.5" aria-hidden />
                  Account
                </a>
              )}

              <button
                role="menuitem"
                onClick={() => { signOut(); setOpen(false); }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-text-muted hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut className="size-3.5" aria-hidden />
                Sign out
              </button>
            </div>
          )}
        </div>
      ) : (
        <SignInButton />
      )}
    </nav>
  );
}
