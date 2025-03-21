import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { getPokemon, getPokemonList } from '../services/api';
import { PokemonCard } from '../components/PokemonCard';
import Filters from '../components/Filter';
import type { Pokemon } from '../types/pokemon';

function Home() {
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 16;
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [pokemonsLenght, setPokemonsLength] = useState<number>(0);

  useEffect(() => {
    const loadPokemons = async () => {
      try {
        setLoading(true);
        setError('');
        if (selectedTypes.length > 0) {
          const pokemonByType = await Promise.all(
            selectedTypes.map(async (type) => {
              const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
              const data = await response.json();
              return data.pokemon.map((entry: any) => entry.pokemon.name);
            })
          );
          const uniquePokemonNames = [...new Set(pokemonByType.flat())];
          const offset = currentPage * limit;
          const paginatedPokemonNames = uniquePokemonNames.slice(offset, offset + limit);
          const pokemonDetails = await Promise.all(paginatedPokemonNames.map((name) => getPokemon(name)));

          setPokemonsLength(uniquePokemonNames.length);
          setFilteredPokemons(pokemonDetails);
        } else {
          const response = await getPokemonList(currentPage * limit, limit);
          const response2 = await getPokemonList();
          const pokemonDetails = await Promise.all(
            response.results.map((pokemon) => getPokemon(pokemon.name))
          );

          setPokemonsLength(response2.count);
          setPokemons(pokemonDetails);
          setFilteredPokemons(pokemonDetails);
        }
      } catch (err) {
        setError('Failed to load Pokémon. Please try again later.');
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
      const pokemon = await getPokemon(searchTerm.toLowerCase());
      setFilteredPokemons([pokemon]);
      setPokemonsLength(1);
    } catch (err) {
      setError('Pokémon not found. Please try another name.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Search here!</h1>
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
              {filteredPokemons.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>

            <div className="flex justify-center mt-8 pb-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
                className={`px-4 py-2 mx-2 text-white rounded ${currentPage === 0 ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'}`}
              >
                Anterior
              </button>
              <h1 className="text-2xl font-bold capitalize mb-2">{currentPage + 1}</h1>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage >= Math.ceil(pokemonsLenght / limit) - 1}
                className={`px-4 py-2 mx-2 text-white rounded ${
                  currentPage >= Math.ceil(pokemonsLenght / limit) - 1
                    ? 'bg-gray-400'
                    : 'bg-blue-500 hover:bg-blue-700'
                }`}
              >
                Próximo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;