# Supermarket Simulator Buddy

A free progress tracker for the game Supermarket Simulator. Keep several playthroughs, track your store level, licenses, store growth, staff, loans and shopping lists, and see what to unlock next. Everything is saved in your browser. There is no account. Cloud sync is optional and keeps your data in your own storage.

Live at [supermarket-simulator.gamerdex.app](https://supermarket-simulator.gamerdex.app).

This is an unofficial fan tool. It is not affiliated with, endorsed by, or connected to Supermarket Simulator or its developers. Game names and images belong to their owners.

## What it does

Each playthrough has one page per game area. Every change saves at once, and a toast offers Undo.

- **Overview**: store level, loans, total investment and progress across management and the market.
- **Market**: all 186 products with search, display type and category filters, and a detail view with the shop they are bought at. Furniture and paint prices. Tools and vehicles you own, with the Tablet's 3 license rule.
- **Management**: licenses with filters and the products each one unlocks, growth and storage sections as an ordered path, staff hiring with daily wages, and store customizations.
- **Bank**: the five loans with a term slider, live interest and payments, and your active loans with totals.
- **Shopping list**: products from your unlocked licenses, grouped by shop, with box counts and a purchased check.
- **Playthroughs**: create, switch, edit and delete, with search and sort.
- **Settings**: cloud sync, language and region, number and date formats, theme (light, dark or system), backup export and import, and reset.

The store level sits in the sidebar, because it gates every unlock.

## Run it

Node 24 and pnpm are required.

```
pnpm install
pnpm dev
```

Then open http://localhost:3000. Other commands:

```
pnpm build
pnpm lint
pnpm test
pnpm format:check
```

Two scripts keep the text catalogs honest:

```
node scripts/check-catalogs.mjs     # every language against English
node scripts/check-i18n.mjs         # text in code that is not in a catalog
```

### Environment variables

All are optional and public (`NEXT_PUBLIC_`). Next.js reads them at build time, so redeploy after a change.

- `NEXT_PUBLIC_GAMERDEX_AUTH_URL`: the address of the sign-in service. The package `@gamerdexapp/gamerdex-sync` has a default. An empty value turns sync off.
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_DROPBOX_CLIENT_ID`, `NEXT_PUBLIC_MICROSOFT_CLIENT_ID`: override the client ID of a sync provider. An empty value leaves that provider out.

## Project structure

- `src/app`: routes. The old `/dashboard` address redirects to `/overview`.
- `src/components`: the app shell, the shared UI kit in `ui/`, and one folder per page.
- `src/lib`: contexts, hooks, services (storage, backup, spending, loans, shopping list, management and market rules) and sync.
- `src/data/supermarket-simulator`: the game data for licenses, sections, staff, products, furniture, paint, tools, vehicles and loans.
- `src/i18n`: the language setup and the text catalogs.
- `tests`: unit tests, run by Vitest, including save compatibility tests against a frozen copy of the old storage code.

## Data and privacy

Your playthroughs are stored in your browser under the `localStorage` key `supermarket-simulator-buddy`, in the same format the app has always used, so older saves and backup files still load. The theme is kept in `supermarket-simulator-buddy-theme`, language and formats in `supermarket-simulator-buddy-prefs`, and the cloud sync sign-in in `supermarket-simulator-buddy-sync`. The tracker has no account. Clearing site data removes everything, so use Settings, Backup and data to export a JSON file. You can import it again later, on this device or another, and choose to merge it or replace everything.

Language, formats, theme and the active playthrough belong to the device. They are not part of the export file or the synced file.

Cloud sync is off until you turn it on in Settings, Cloud sync. You choose Google Drive, Dropbox, OneDrive or GitHub, and the app keeps one file in your own storage. The file has the same format as the export file. A small sign-in service, [gamerdex-auth](https://github.com/GamerdexApp/gamerdex-auth), only exchanges the login token and does not see or keep your data. See the [privacy policy](https://gamerdex.app/privacy).

## Language support

The app ships in 19 languages: English, Arabic, German, Spanish (Spain and Latin America), French, Indonesian, Italian, Japanese, Korean, Malay, Portuguese (Brazil and Portugal), Russian, Thai, Turkish, Vietnamese and Chinese (Simplified and Traditional). Arabic reads right to left. The text lives in catalogs under `src/i18n/messages/<code>/`, so a new language is a new catalog folder and one entry in `src/i18n/locales.ts`. Game names such as products, companies, tools, vehicles and shops stay in English.

## Contributing

Issues and pull requests are welcome. Read [CONTRIBUTING.md](.github/CONTRIBUTING.md) first, or ask on [Discord](https://discord.gg/gc773YF9Jh).

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

MIT. See [LICENSE](LICENSE). The game, its name and its content belong to their owners.
