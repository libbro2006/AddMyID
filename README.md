# AddMyID

A consumer-facing reference site that helps US residents add their digital ID or passport to their phone. Live at [addmyid.info](https://addmyid.info).

## What it does

Covers 21 participating states and territories (sourced from the TSA's official participating states list), with step-by-step setup instructions for Apple Wallet, Google Wallet, Samsung Wallet, and state-specific apps. Also covers adding a US passport to Apple Wallet and Google Wallet.

## Tech

Built with [Astro](https://astro.build) and Tailwind CSS. Fully static output.

## Project structure

```
src/
  data/
    states/          # One JSON file per state/territory
    platforms.json   # Apple, Google, and Samsung Wallet guide data
  pages/
    index.astro      # Homepage with state grid and wallet cards
    state/[state]    # Per-state detail page
    guides/[platform] # Per-wallet guide page
  components/
    StateSearch.astro
    WalletCard.astro
  layouts/
    Layout.astro     # Shared nav, header, footer
```

## Adding a state

Drop a new JSON file in `src/data/states/` following the schema in `_template.json`. No code changes needed — the state will appear automatically in the grid and search.

## Wallet guide pages

Platform data in `platforms.json` supports:

- `supported_documents` — listed under "What you can add"
- `requirements` — listed under "What you need"
- `step_groups` — array of `{ title, steps }` for multi-section instructions (used when a platform supports both state IDs and passports); falls back to `general_steps` if absent
- `participating_states` — optional array of state names rendered as a list on the guide page (currently used for Apple and Samsung)

## Deploying

Work happens on `main`. To publish, push to the `published` branch:

```bash
git push origin main:published
```

This triggers a GitHub Actions build that deploys to GitHub Pages with the custom domain.
