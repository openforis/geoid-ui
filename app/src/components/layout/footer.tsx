"use client";

import { Link } from "@/components/ui/link";

const Sep = () => <span className="px-2 text-xs text-text-muted select-none">·</span>;

export function Footer({ apiDocsUrl }: { apiDocsUrl?: string | null }) {
  const version = process.env.NEXT_PUBLIC_APP_VERSION;

  return (
    <footer className="flex flex-wrap items-center gap-y-1 border-t border-border px-8 py-4 text-xs text-text-muted">
      <span className="whitespace-nowrap pr-1">
        © 2026{" "}
        <Link href="https://openforis.org" variant="muted" target="_blank" rel="noopener noreferrer">
          Open Foris
        </Link>
      </span>
      {apiDocsUrl && (
        <>
          <Sep />
          <Link href={apiDocsUrl} variant="muted" target="_blank" rel="noopener noreferrer">
            API docs
          </Link>
        </>
      )}
      <Sep />
      <Link
        href="https://www.fao.org/contact-us/data-protection-and-privacy/en/"
        variant="muted"
        className="whitespace-nowrap"
        target="_blank"
        rel="noopener noreferrer"
      >
        Privacy Policy
      </Link>
      <Sep />
      <Link
        href="https://www.openforis.org/geoid-terms/"
        variant="muted"
        className="whitespace-nowrap"
        target="_blank"
        rel="noopener noreferrer"
      >
        Terms of Service
      </Link>
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
