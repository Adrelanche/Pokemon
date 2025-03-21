import axios from 'axios';
import type { Pokemon, PokemonListResponse, TypeListResponse } from '../types/pokemon';

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
});

export const backend = axios.create({
  baseURL: 'http://localhost:8000',
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
