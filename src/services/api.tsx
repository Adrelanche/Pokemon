import axios from 'axios';
import type { Pokemon, PokemonListResponse, TypeListResponse } from '../types/pokemon';
import { getToken, isLoggedIn } from '../Auth/Auth';

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
});



export const getPokemonList = async (offset = 0, limit = 30): Promise<PokemonListResponse> => {
  const response = await api.get<PokemonListResponse>(`/pokemon?offset=${offset}&limit=${limit}`);
  return response.data;
};

export const getPokemon = async (nameOrId: string | number): Promise<Pokemon> => {
  const response = await api.get<Pokemon>(`/pokemon/${nameOrId}`);
  return response.data;
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
  // Verifica se o usuário está autenticado antes de fazer a requisição
  if (!isLoggedIn()) {
    console.warn("Usuário não está logado. Redirecionando para login...");
    return { error: "Usuário não autenticado." };
  }

  try {
    const token = getToken(); // Obtém o token válido do sessionStorage
    const response = await backend.patch(
      '/api/favorite/',
      { pokemon_name: pokemonName, pokemon_id: pokemonId },
      { headers: { Authorization: `Bearer ${token}` } } // Passa o token no cabeçalho
    );

    return response;
  } catch (error) {
    console.error("Erro ao favoritar:", error);
    throw error;
  }
};

export const apiGetFavorites = async () => {
  if (!isLoggedIn()) {
    console.warn("Usuário não está logado. Redirecionando para login...");
    return { error: "Usuário não autenticado." };
  }
  try {
    const token = getToken(); // Obtém o token válido do sessionStorage
    const response = await backend.get(
      '/api/favorite/', 
      { headers: { Authorization: `Bearer ${token}` } } // Passa o token no cabeçalho
    );

    // Verifica se a resposta contém favoritos
    if (response.data.favorite_pokemons) {
      return response.data.favorite_pokemons; // Retorna apenas a lista de Pokémon favoritos
    } else {
      return { error: "Nenhum Pokémon favorito encontrado." };
    }
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    return { error: "Erro ao buscar favoritos." }; // Retorna uma mensagem de erro caso a requisição falhe
  }
};

