# GeoID UI

Web app for GeoID: register GeoJSON features to mint stable GeoIDs, and resolve GeoIDs back to GeoJSON. GeoJSON can be uploaded, pasted or drawn on a map.

## Development

Requires Node.js 22+.

```bash
cd app
cp .env.example .env.local
npm install
npm run dev
```

The app runs at http://localhost:3000.

## Configuration

Set in `app/.env.local`:

| Variable | Description |
|---|---|
| `GEOID_BASE_URL` | GeoID API base URL |
| `MAX_REQUEST_BODY_SIZE_KB` | Upload size limit (default 1024) |
| `MAX_MAP_FEATURES` | Most features the map opens (default 100) |
| `CARTO_BASEMAP_KEY` | CARTO basemap key (optional) |
| `AUTH_SECRET`, `KEYCLOAK_*` | Keycloak sign-in, off until `KEYCLOAK_ISSUER` is set |

## Releases

The version lives in `.version`. Running **Create Release** on `main` tags `vX.Y.Z`, creates the `release/vX.Y.Z` branch and bumps `.version`. **Build** pushes an image tagged with the version for `main` and release branches, and **Deploy** rolls it out to an environment.

## License

[MIT](LICENSE)
