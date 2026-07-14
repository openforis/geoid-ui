import { auth } from "@/auth";
import { requireGeoidClient } from "@/lib/geoid/client";
import type { PlaceRecord } from "@/lib/geoid/types";
import { Alert } from "@/components/ui/alert";
import { Link } from "@/components/ui/link";
import { cardBase } from "@/components/ui/styles";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

export default async function MyGeoidsPage({
  searchParams,
}: {
  searchParams: Promise<{ offset?: string }>;
}) {
  const session = await auth();
  const offset = Number((await searchParams).offset) || 0;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col min-h-0 gap-5">
      <h1 className="text-2xl font-semibold tracking-tight text-text-primary">My GeoIDs</h1>

      {!session?.user ? (
        <p className="text-sm text-text-muted">Sign in to view the GeoIDs you&apos;ve registered.</p>
      ) : (
        <MyGeoidsList offset={offset} />
      )}
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
    return <p className="text-sm text-text-muted">You haven&apos;t registered any GeoIDs yet.</p>;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className={`min-h-0 flex-1 overflow-auto ${cardBase}`}>
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-surface text-text-muted">
            <tr className="border-b border-border">
              <th className="px-3 py-2 font-medium">GeoID</th>
              <th className="px-3 py-2 font-medium">Collection</th>
              <th className="px-3 py-2 font-medium">External ID</th>
              <th className="px-3 py-2 font-medium">Registered</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.geoid} className="border-b border-border last:border-0">
                <td className="px-3 py-2 font-mono">
                  <Link href={record.uri}>{record.geoid}</Link>
                </td>
                <td className="px-3 py-2 text-text-primary">{record.collection}</td>
                <td className="px-3 py-2 text-text-muted">{record.external_id ?? "—"}</td>
                <td className="px-3 py-2 text-text-muted">
                  {new Date(record.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between text-sm">
        {offset > 0 ? (
          <Link href={`/my-geoids?offset=${Math.max(0, offset - PAGE_SIZE)}`}>Previous</Link>
        ) : (
          <span />
        )}
        {records.length === PAGE_SIZE && (
          <Link href={`/my-geoids?offset=${offset + PAGE_SIZE}`}>Next</Link>
        )}
      </div>
    </div>
  );
}
