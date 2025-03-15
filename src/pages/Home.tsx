import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { getPokemon, getPokemonList } from '../services/api';
import { PokemonCard } from '../components/PokemonCard';
import Filters from '../components/Filter';
import type { Pokemon } from '../types/pokemon';

function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPokemons = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getPokemonList(0, 16);
        const pokemonDetails = await Promise.all(
          response.results.map((pokemon) => getPokemon(pokemon.name))
        );
        setPokemons(pokemonDetails);
        setFilteredPokemons(pokemonDetails);
      } catch (err) {
        setError('Failed to load Pokémon. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadPokemons();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      setError('');
      const pokemon = await getPokemon(searchTerm.toLowerCase());
      setPokemons([pokemon]);
      setFilteredPokemons([pokemon]);
    } catch (err) {
      setError('Pokémon not found. Please try another name.');
    } finally {
      setLoading(false);
    }
  };

  //Estilizar a div do Search
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Search here!</h1>
          <div>
            <Filters pokemons={pokemons} onFilter={setFilteredPokemons} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPokemons.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;