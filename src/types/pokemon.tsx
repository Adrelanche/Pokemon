export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
    };
  };
  types: TypeInfo[];
  stats: StatInfo[];
}

export interface TypeInfo {
  type: {
    name: string;
  };
}

export interface StatInfo {
  base_stat: number;
  stat: {
    name: string;
  };
}

export interface PokemonListResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: Array<{ name: string; url: string }>;
}

export interface Type {
  name: string;
  url: string;
}

export interface TypeListResponse {
  results: Type[];
}
