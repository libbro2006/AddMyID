interface Wallet {
  id: string;
  name: string;
  available: boolean;
  coming_soon: boolean;
  official_url?: string;
  app_name?: string;
  app_store_url?: string;
  play_store_url?: string;
  steps?: string[];
}

export interface State {
  name: string;
  abbreviation: string;
  slug: string;
  mdl_status: 'live' | 'coming_soon' | 'not_available';
  last_updated: string;
  notes?: string;
  official_url?: string;
  wallets: Wallet[];
}

export async function getCollection(): Promise<State[]> {
  const modules = import.meta.glob<State>('../data/states/*.json', {
    import: 'default',
    eager: true,
  });
  return Object.values(modules)
    .filter((s) => !s.slug?.startsWith('_'))
    .sort((a, b) => a.name.localeCompare(b.name));
}
