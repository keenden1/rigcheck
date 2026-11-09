# Rigcheck PH

A Next.js + TypeScript + Tailwind CSS app for comparing used PC builds in the Philippines. Lucide icons; localStorage persistence with validated JSON backup/import. No API keys or database required.

## Run locally

```sh
npm install
npm run dev
```

## Verify

```sh
npm test
npm run build
```

## Deploy to Vercel

Push this folder to a GitHub repository and import it in Vercel. Select Next.js (normally detected automatically), use `npm run build`, and leave the output directory default. If importing a parent repository, set the root directory to `rigcheck-ph`. No environment variables are required. Alternatively, run `npx vercel` from this directory after signing in.

## Features

- Editable component descriptions, cores/threads, asking price, condition, platform details and component valuations.
- Search, workload filters, sorting, saved shortlists, and multi-build comparison.
- Explicit PSU, missing component, display-output, socket and memory warnings.
- Transparent workload suitability scores, upgrade notes and qualitative constraints.
- Persistent local records, JSON export and merge import. All initial builds are illustrative samples, not listings.

## Assessment limits

Prices are user-maintained planning estimates, not live Philippine market data. The range is 85–110% of entered component values, adjusted by tested (1), untested (0.8), or needs repair (0.55), rounded to PHP 100. Unknown values produce a partial estimate. Shipping and repairs are excluded. See `src/lib/analysis.ts` for the rules. Workload scores are coarse heuristics, not benchmarks. Compatibility uses explicit entered sockets and memory types; exact model support, BIOS, power, physical fit and thermals must still be checked. Platform guidance references AMD's official AM4 chipset documentation: https://www.amd.com/en/products/processors/chipsets/am4.html.

## Optional cloud phase

Add Supabase Auth + Postgres when multi-device sync is needed. Store builds in a table with a user_id and enforce owner-only row-level security for every operation. Keep the current import/export format for migration. This version does not include cloud accounts or synchronization. React Hook Form + Zod and shadcn/ui can be added if form complexity grows; current forms use native validation and explicit import validation.

Browser storage is scoped to device, browser and origin. Export before clearing browser data or moving to the deployed URL.
