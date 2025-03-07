import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { getPokemon, getPokemonList } from '../services/api';

vi.mock('../services/api', () => ({
  getPokemonList: vi.fn(),
  getPokemon: vi.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Pokédex title', () => {
    render(<App />);
    expect(screen.getByText('Pokédex')).toBeInTheDocument();
  });

  it('loads and displays Pokémon on initial render', async () => {
    const mockPokemonList = {
      results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1' }],
    };

    const mockPokemon = {
      id: 1,
      name: 'bulbasaur',
      sprites: {
        other: { 'official-artwork': { front_default: 'bulbasaur.png' } },
      },
      types: [{ type: { name: 'grass' } }],
      stats: [],
    };

    (getPokemonList as any).mockResolvedValue(mockPokemonList);
    (getPokemon as any).mockResolvedValue(mockPokemon);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });
  });

  it('handles search functionality', async () => {
    const mockPokemon = {
      id: 25,
      name: 'pikachu',
      sprites: {
        other: { 'official-artwork': { front_default: 'pikachu.png' } },
      },
      types: [{ type: { name: 'electric' } }],
      stats: [],
    };

    (getPokemon as any).mockResolvedValue(mockPokemon);

    render(<App />);

    const searchInput = screen.getByPlaceholderText('Search Pokémon by name...');
    fireEvent.change(searchInput, { target: { value: 'pikachu' } });
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });
  });

  it('displays error message when Pokémon is not found', async () => {
    (getPokemon as any).mockRejectedValue(new Error('Not found'));

    render(<App />);

    const searchInput = screen.getByPlaceholderText('Search Pokémon by name...');
    fireEvent.change(searchInput, { target: { value: 'invalidpokemon' } });
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Pokémon not found. Please try another name.')).toBeInTheDocument();
    });
  });
});