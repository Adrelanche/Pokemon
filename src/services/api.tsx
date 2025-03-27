import axios from 'axios';
import type { Pokemon, PokemonListResponse, TypeListResponse } from '../types/pokemon';
import { getToken } from '../Auth/Auth';

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
});

export const getPokemon = async (nameOrId: string | number): Promise<Pokemon> => {
  const response = await api.get(`/pokemon/${nameOrId}`);
  const data = response.data;

  return {
    id: data.id,
    name: data.name,
    sprites: {
      front_default: data.sprites.front_default,
      other: {
        'official-artwork': {
          front_default: data.sprites.other['official-artwork'].front_default
        }
      }
    },
    types: data.types.map((t: any) => ({
      type: { name: t.type.name }
    })),
    stats: data.stats.map((s: any) => ({
      base_stat: s.base_stat,
      stat: { name: s.stat.name }
    }))
  };
};
export const getTypes = async (): Promise<TypeListResponse> => {
  const response = await api.get<TypeListResponse>('/type');
  return response.data;
};

export const apiLogin = async (credentials: { username: string, password: string }) => {
  try {
    const response = await backend.post('/api/login/', credentials);
    return response;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};

export const backend = axios.create({
  baseURL: 'http://localhost:8000',
});

export const apiSetFavorites = async (pokemonName: string, pokemonId: number) => {
  try {
    const token = getToken();
    const response = await backend.patch(
      '/api/favorite/',
      { pokemon_name: pokemonName, pokemon_id: pokemonId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response;
  } catch (error) {
    console.error("Erro ao favoritar:", error);
    throw error;
  }
};

export const apiGetFavorites = async () => {
  try {
    const token = getToken();
    const response = await backend.get('/api/favorite/', {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data.favorite_pokemons || [];
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    return { error: "Erro ao buscar favoritos. Tente novamente mais tarde." };
  }
};

export const apiPatchFavoritesOrder = async (pokemonOrder: number, pokemonID: number) => {
  try {
    const token = getToken();
    const response = await backend.patch('/api/favorite-order/',
    {order: pokemonOrder, pokemon_id: pokemonID},
    { headers: { Authorization: `Bearer ${token}` } })
    return response
  } catch(error){
    console.error("Erro ao mudar a ordem:", error);
  }
}

