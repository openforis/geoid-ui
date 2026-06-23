import { ConverterPanel } from "@/components/converter/converter-panel";
import { getSubmissionConfig } from "@/lib/server/env";

export const dynamic = "force-dynamic";

export default function Home() {
  const maxFileSize = getSubmissionConfig().maxRequestBodySizeKb * 1024;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col min-h-0 gap-5">
      <div className="shrink-0 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
          GeoID
        </h1>
        <p className="mx-auto mt-2 max-w-3xl text-sm leading-relaxed text-text-muted">
          Register GeoJSON features in a collection to mint stable GeoIDs—persistent identifiers
          for geospatial geometries. Resolve existing GeoIDs back to GeoJSON at any time. The same
          geometry always maps to the same ID, so locations can be referenced and shared across
          applications without passing full shapes.
        </p>
      </div>
      <ConverterPanel className="min-h-0 flex-1" maxFileSize={maxFileSize} />
    </div>
  );
}
