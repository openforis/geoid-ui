import { auth } from "@/auth";
import { requireGeoidClient } from "@/lib/geoid/client";
import type { PlaceRecord } from "@/lib/geoid/types";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import { PageSection } from "@/components/layout/page-section";
import { SignInButton } from "@/components/layout/sign-in-button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

export default async function MyGeoidsPage({
  searchParams,
}: {
  searchParams: Promise<{ offset?: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <p className="text-sm text-text-muted">Sign in to view the GeoIDs you&apos;ve registered.</p>
        <SignInButton />
      </div>
    );
  }

  const offset = Number((await searchParams).offset) || 0;

  return (
    <div className="mx-auto flex w-full max-w-5xl min-h-0 flex-1 flex-col">
      <PageSection title="My GeoIDs" className="min-h-0 flex-1">
        <MyGeoidsList offset={offset} />
      </PageSection>
    </div>
  );
}

async function MyGeoidsList({ offset }: { offset: number }) {
  let records: PlaceRecord[];
  try {
    const client = await requireGeoidClient();
    records = await client.listMyGeoids({ limit: PAGE_SIZE, offset });
  } catch (err) {
    return <Alert type="error" message={(err as Error).message} />;
  }

  if (records.length === 0 && offset === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6 text-sm text-text-muted">
          You haven&apos;t registered any GeoIDs yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="min-h-0 flex-1 gap-0 p-0">
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse text-xs">
          <thead className="sticky top-0 z-10 bg-surface">
            <tr className="border-b border-border">
              <th className="px-4 py-2.5 text-left text-[10px] font-semibold tracking-[0.08em] text-text-muted uppercase">
                GeoID
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-semibold tracking-[0.08em] text-text-muted uppercase">
                Collection
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-semibold tracking-[0.08em] text-text-muted uppercase">
                External ID
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-semibold tracking-[0.08em] text-text-muted uppercase">
                Registered
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr
                key={record.geoid}
                className="border-b border-border transition-colors last:border-0 hover:bg-surface-raised/60"
              >
                <td className="px-4 py-2.5 font-mono text-[11px]">
                  <Link href={record.uri} target="_blank" rel="noopener noreferrer">
                    {record.geoid}
                  </Link>
                </td>
                <td className="px-4 py-2.5 text-text-primary">{record.collection}</td>
                <td className="px-4 py-2.5 text-text-muted">{record.external_id ?? "—"}</td>
                <td className="px-4 py-2.5 text-text-muted">
                  {new Date(record.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(offset > 0 || records.length === PAGE_SIZE) && (
        <div className="flex shrink-0 items-center gap-2 border-t border-border bg-surface px-4 py-2 text-xs text-text-muted">
          <span>
            Showing {offset + 1}–{offset + records.length}
          </span>
          <div className="flex-1" />
          {offset > 0 && (
            <Button
              variant="outline"
              size="icon-sm"
              nativeButton={false}
              render={<Link href={`/my-geoids?offset=${Math.max(0, offset - PAGE_SIZE)}`} />}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-3.5" />
            </Button>
          )}
          {records.length === PAGE_SIZE && (
            <Button
              variant="outline"
              size="icon-sm"
              nativeButton={false}
              render={<Link href={`/my-geoids?offset=${offset + PAGE_SIZE}`} />}
              aria-label="Next page"
            >
              <ChevronRight className="size-3.5" />
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
