"use client";

import { Link } from "@/components/ui/link";

const Sep = () => <span className="px-2 text-xs text-text-muted select-none">·</span>;

export function Footer() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION;

  return (
    <footer className="flex flex-wrap items-center gap-y-1 border-t border-border px-8 py-4 text-xs text-text-muted">
      <span className="whitespace-nowrap pr-1">
        © 2026{" "}
        <Link href="https://openforis.org" variant="muted" target="_blank" rel="noopener noreferrer">
          Open Foris
        </Link>
      </span>
      <Sep />
      {version && (
        <>
          <div className="ml-auto">
            <span>App v{version}</span>
          </div>
        </>
      )}
    </footer>
  );
}
