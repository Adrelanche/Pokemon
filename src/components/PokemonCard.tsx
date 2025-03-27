import React, { useEffect, useState } from 'react';
import { Heart, HeartOff } from 'lucide-react';
import type { Pokemon } from '../types/pokemon';
import services from '../services/Services';
import { isLoggedIn } from '../Auth/Auth';
import { useDrag, useDrop } from 'react-dnd';

interface PokemonCardProps {
  pokemon: Pokemon;
  favoritePokemons: { name: string; id: number }[];
  setFavoritePokemons: React.Dispatch<React.SetStateAction<{ name: string; id: number }[]>>;
  moveCard?: (draggedId: number, hoveredId: number) => void;
}

const typeColors: Record<string, string> = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-blue-200',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-green-600',
  rock: 'bg-yellow-800',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
};

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, favoritePokemons, setFavoritePokemons, moveCard }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(favoritePokemons.some(fav => fav.id === pokemon.id));
  }, [favoritePokemons, pokemon.id]);

  const toggleFavorite = async () => {
    try {
      await services.apiSetFavorites(pokemon.name, pokemon.id);
      if (isFavorite) {
        setFavoritePokemons(favoritePokemons.filter(fav => fav.id !== pokemon.id));
      } else {
        setFavoritePokemons([...favoritePokemons, { name: pokemon.name, id: pokemon.id }]);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Erro ao favoritar Pokémon:', error);
    }
  };

  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { id: pokemon.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'CARD',
    drop: (item: { id: number }) => {
      if (moveCard) {
        moveCard(item.id, pokemon.id);
      }
    },
  });

  const opacity = isDragging ? 0.5 : 1;

  return (
    <div
    ref={(node) => drag(drop(node))}
    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow relative"
    style={{ opacity }}
  >
      {isLoggedIn() && 
      <button
        onClick={toggleFavorite}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
      >
        {isFavorite ? <Heart fill="red" size={24} /> : <HeartOff size={24} />}
      </button>
      }

      <div className="relative">
        <img
          src={pokemon.sprites?.other?.['official-artwork']?.front_default || 'default_image_url'}
          alt={pokemon.name}
          className="w-full h-48 object-contain"
        />
      </div>
      <div className="mt-4">
        <h2 className="text-2xl font-bold capitalize mb-2">{pokemon.name}</h2>
        <div className="flex gap-2 mb-4">
          {Array.isArray(pokemon.types) ? (
            pokemon.types.map((type) => (
              <span
                key={type.type.name}
                className={`${typeColors[type.type.name] || 'bg-gray-400'} text-white px-3 py-1 rounded-full text-sm capitalize`}
              >
                {type.type.name}
              </span>
            ))
          ) : (
            <div>No types available</div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {Array.isArray(pokemon.stats) ? (
            pokemon.stats.map((stat) => (
              <div key={stat.stat.name}>
                <p className="text-sm text-gray-600 capitalize">
                  {stat.stat.name.replace('-', ' ')}: {stat.base_stat}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <div>No stats available</div>
          )}
        </div>
      </div>
    </div>
  );
};
