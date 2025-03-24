import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { apiGetFavorites, getPokemon } from '../services/api';
import { PokemonCard } from '../components/PokemonCard';
import Filters from '../components/Filter';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Pokemon } from '../types/pokemon';

function Favorites() {
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 16;
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [pokemonsLength, setPokemonsLength] = useState(0);
  const [favoritePokemons, setFavoritePokemons] = useState<{ name: string; id: number }[]>([]);

  useEffect(() => {
    const loadPokemons = async () => {
      try {
        setLoading(true);
        setError('');
  
        const favoritePokemons = await apiGetFavorites();
        if (favoritePokemons.error) {
          setError(favoritePokemons.error);
          return;
        }
  
        const pokemonPromises = favoritePokemons.map((p: { name: string; id: number }) => getPokemon(p.name));
        const allPokemons = await Promise.all(pokemonPromises);
  
        let filtered = allPokemons;
        if (selectedTypes.length > 0) {
          filtered = allPokemons.filter((pokemon) =>
            pokemon.types.some((type: { type: { name: string } }) =>
              selectedTypes.includes(type.type.name)
            )
          );
        }
  
        const offset = currentPage * limit;
        const paginatedPokemons = filtered.slice(offset, offset + limit);
  
        setPokemonsLength(filtered.length);
        setFilteredPokemons(paginatedPokemons);
      } catch (err) {
        setError('Failed to load Pokémon favorites.');
      } finally {
        setLoading(false);
      }
    };
  
    loadPokemons();
  }, [currentPage, selectedTypes]);
  
  

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
  
    try {
      setLoading(true);
      setError('');
  
      const favoritePokemons: { name: string; id: number }[] = await apiGetFavorites();
      if (!favoritePokemons || favoritePokemons.length === 0) {
        setError('No favorite Pokémon found.');
        return;
      }
  
      const pokemonNames: string[] = favoritePokemons.map((p) => p.name);
  
      const filteredNames = pokemonNames.filter((name: string) =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      if (filteredNames.length === 0) {
        setError('Pokémon not found in favorites. Please try another name.');
        setFilteredPokemons([]);
        return;
      }
  
      const pokemonPromises = filteredNames.map((name: string) => getPokemon(name));
      const pokemonData = await Promise.all(pokemonPromises);
  
      setFilteredPokemons(pokemonData);
      setPokemonsLength(pokemonData.length);
    } catch (err) {
      setError('Failed to search for Pokémon favorites.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favorites = await apiGetFavorites();
        setFavoritePokemons(favorites);
      } catch (error) {
        console.error('Erro ao buscar favoritos:', error);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Favorite Pokémon</h1>
          <div className="flex flex-row justify-center items-center mb-8 mx-auto w-full max-w-5xl gap-4">
            <Filters onFilter={setSelectedTypes} />

            <div className="w-full max-w-md relative">
              <input
                type="text"
                placeholder="Search Pokémon by name or id . . ."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <Search size={30} />
              </button>
            </div>
          </div>
        </div>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPokemons.map((pokemon) => {
              return (
                <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                favoritePokemons={favoritePokemons}
                setFavoritePokemons={setFavoritePokemons}
              />
              );
            })}
            </div>

            <div className="flex justify-center mt-8 pb-8">
              <Stack spacing={2}>
                <Pagination
                  defaultPage={1}
                  color="primary"
                  count={Math.ceil(pokemonsLength / limit)}
                  page={currentPage + 1}
                  onChange={(event, page) => setCurrentPage(page - 1)}
                  showFirstButton
                  showLastButton
                  size="large"
                />
              </Stack>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Favorites;
