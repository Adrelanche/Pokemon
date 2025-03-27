import axios from "axios";
import { PATHAPI } from "./PathApi";
import { getToken } from '../Auth/Auth';
import type { Pokemon, PokemonListResponse, TypeListResponse } from '../types/pokemon';

const services = {
  getPokemon: async (nameOrId: string | number): Promise<Pokemon> => {
    try {
      const { data } = await axios.get(`${PATHAPI.base}/pokemon/${nameOrId}`);
      
      return {
        id: data.id,
        name: data.name,
        sprites: {
          front_default: data.sprites.front_default,
          other: {
            'official-artwork': {
              front_default: data.sprites.other['official-artwork'].front_default,
            },
          },
        },
        types: data.types.map((t: any) => ({
          type: { name: t.type.name },
        })),
        stats: data.stats.map((s: any) => ({
          base_stat: s.base_stat,
          stat: { name: s.stat.name },
        })),
      };
    } catch (error) {
      console.error("Erro ao buscar Pokémon:", error);
      throw new Error("Falha ao carregar informações do Pokémon.");
    }
  },

  getPokemonList: async (offset = 0, limit = 30): Promise<{ pokemons: Pokemon[], totalCount: number }> => {
    try {
      const { data } = await axios.get<PokemonListResponse>(`${PATHAPI.base}/pokemon?offset=${offset}&limit=${limit}`);
      const pokemonDetails = await Promise.all(data.results.map((pokemon) => services.getPokemon(pokemon.name)));

      return { pokemons: pokemonDetails, totalCount: data.count };
    } catch (error) {
      console.error("Erro ao buscar lista de Pokémon:", error);
      throw new Error("Falha ao carregar lista de Pokémons.");
    }
  },
  
  getTypes: async (): Promise<TypeListResponse> => {
    try {
      const { data } = await axios.get<TypeListResponse>(`${PATHAPI.base}/type`);
      return data;
    } catch (error) {
      console.error("Erro ao buscar tipos de Pokémon:", error);
      throw new Error("Falha ao carregar tipos de Pokémon.");
    }
  },

  apiLogin: async (credentials: { username: string, password: string }) => {
    try {
      return await axios.post(`${PATHAPI.baseBack}/api/login/`, credentials);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw new Error("Falha ao autenticar usuário.");
    }
  },

  apiSetFavorites: async (pokemonName: string, pokemonId: number) => {
    try {
      const token = getToken();
      return await axios.patch(
        `${PATHAPI.baseBack}/api/favorite/`,
        { pokemon_name: pokemonName, pokemon_id: pokemonId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Erro ao favoritar Pokémon:", error);
      throw new Error("Não foi possível favoritar o Pokémon.");
    }
  },

  apiGetFavorites: async () => {
    try {
      const token = getToken();
      const { data } = await axios.get(`${PATHAPI.baseBack}/api/favorite/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return data.favorite_pokemons || [];
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
      throw new Error("Falha ao carregar favoritos.");
    }
  },

  apiPatchFavoritesOrder: async (pokemonOrder: number, pokemonID: number) => {
    try {
      const token = getToken();
      return await axios.patch(
        `${PATHAPI.baseBack}/api/favorite-order/`,
        { order: pokemonOrder, pokemon_id: pokemonID },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Erro ao mudar a ordem dos favoritos:", error);
      throw new Error("Falha ao atualizar a ordem dos favoritos.");
    }
  }
};

export default services;
