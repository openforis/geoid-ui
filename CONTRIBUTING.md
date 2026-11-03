# Contributing to geoid-ui

Thanks for helping improve geoid-ui, the web interface for GeoID. Bug reports, ideas, documentation and code are all welcome.

## Code of Conduct

Everyone who takes part in this project is expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md). To report harassment or abuse, see [how to report](CODE_OF_CONDUCT.md#how-to-report-harassment-or-abuse).

## Issues

Use [issues](https://github.com/openforis/geoid-ui/issues) for bugs, feature ideas and questions. Check first that yours hasn't been raised already. For a bug, include the steps to reproduce it, what you expected, what happened instead, and your browser.

Problems with the GeoID API itself belong in [un-fao/fao-geoid](https://github.com/un-fao/fao-geoid/issues).

Don't report security vulnerabilities in a public issue. Email Open-Foris@fao.org instead.

## How we work

We use trunk-based development. `main` is the only long-lived branch, and every contribution reaches it through a pull request.

- Fork the repository and create a branch from the latest `main`.
- Keep each pull request small and focused on one change.
- Rebase on `main` (or merge it in) while you work, so your branch stays current.
- Every pull request must leave the app working.
- For a larger change, open an issue first so we can agree on the approach before you start.

## Local setup

You need Node.js 22 and npm. The app lives in `app/`:

```bash
cd app
npm ci
cp .env.example .env.local
npm run dev    # http://localhost:3000
```

`.env.example` works as is: it points at the GeoID review environment, with sign-in off.

## Pull requests

No checks run on pull requests, so run these from `app/` before you open one:

```bash
npm run lint
npm run build    # also type-checks
```

There's no automated test suite, so say in the pull request how you checked your change, and add screenshots for visible UI changes.

Describe what changed and why, and link the issue it resolves (for example `Fixes #12`) so the issue closes on merge. A maintainer will review the pull request and may ask for changes before merging it.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
