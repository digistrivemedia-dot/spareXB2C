# SpareX B2C: Kannali Garage customer website

Bike and scooter parts that show whether they fit your bike, plus garage services, for Kannali Garage in Bengaluru.

## Getting started

```bash
nvm use          # Node 24 LTS
npm install
cp .env.example .env.local
npm run dev      # http://localhost:3000
```

| Script                        | What it does                           |
| ----------------------------- | -------------------------------------- |
| `npm run dev`                 | Development server                     |
| `npm run build` / `npm start` | Production build and server            |
| `npm run lint`                | ESLint                                 |
| `npm run typecheck`           | TypeScript, no emit                    |
| `npm run format`              | Prettier (with Tailwind class sorting) |

## How data works

Screens never touch demo data directly. They call functions in `src/features/<feature>/api.ts`, which return demo
data from `src/mocks/` or call the backend through `src/lib/api-client.ts`, depending on the switch for that feature in
`src/lib/config.ts`. Data shapes live in each feature's `types.ts`: they are the contract with the backend (string ids,
ISO dates, money in integer paise, lists as `Paginated<T>`).

## Where things live

- `src/app` routes only: `(store)` for the storefront, `account` for the signed-in area, `login`.
- `src/components/ui` shared UI (shadcn components, restyled), `src/components/layout` header, footer and navigation.
- `src/features/*` one folder per feature: `api.ts`, `types.ts`, `components/`, plus `store.ts` or `utils.ts` if needed.
- `src/lib` helpers: formatting, config, API client, navigation (every menu reads from `navigation.ts`).
