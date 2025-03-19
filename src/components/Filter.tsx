import { useState, useEffect } from "react";
import type { Pokemon } from "../types/pokemon";
import { getTypes } from "../services/api";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

interface FiltersProps {
  pokemons: Pokemon[];
  onFilter: (filteredPokemons: Pokemon[]) => void;
}

export default function Filters({ pokemons, onFilter }: FiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [allTypes, setAllTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchTypes = async () => {
      const typesData = await getTypes();
      setAllTypes(typesData.results.map((t) => t.name));
    };
    fetchTypes();
  }, []);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedFilters(event.target.value as string[]);
  };

  useEffect(() => {
    const applyFilters = () => {
      if (selectedFilters.length === 0) {
        onFilter(pokemons);
      } else {
        const filtered = pokemons.filter((pokemon) =>
          pokemon.types.some((t) => selectedFilters.includes(t.type.name))
        );
        onFilter(filtered);
      }
    };
    applyFilters();
  }, [selectedFilters, pokemons]);

  return (
    <div>
      <FormControl sx={{ m: 1, width: 150 }}>
        <InputLabel id="demo-multiple-checkbox-label">Filter</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedFilters}
          onChange={handleChange}
          input={<OutlinedInput label="Filter" />}
          renderValue={(selected) => selected.join(', ')}
        >
          {allTypes.map((type) => (
            <MenuItem key={type} value={type}>
              <Checkbox checked={selectedFilters.includes(type)} />
              <ListItemText primary={type} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
