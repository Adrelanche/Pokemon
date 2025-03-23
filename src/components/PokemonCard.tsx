import React, { useState } from 'react';
import { Heart, HeartOff } from 'lucide-react';
import type { Pokemon } from '../types/pokemon';
import { apiSetFavorites } from '../services/api';
import { isLoggedIn } from '../Auth/Auth';

interface PokemonCardProps {
  pokemon: Pokemon;
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

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = async () => {
    try {
      await apiSetFavorites(pokemon.name, pokemon.id);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Erro ao favoritar Pokémon:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow relative">
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
          src={pokemon.sprites.other['official-artwork'].front_default}
          alt={pokemon.name}
          className="w-full h-48 object-contain"
        />
      </div>
      <div className="mt-4">
        <h2 className="text-2xl font-bold capitalize mb-2">{pokemon.name}</h2>
        <div className="flex gap-2 mb-4">
          {pokemon.types.map((type) => (
            <span
              key={type.type.name}
              className={`${
                typeColors[type.type.name]
              } text-white px-3 py-1 rounded-full text-sm capitalize`}
            >
              {type.type.name}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {pokemon.stats.map((stat) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};
