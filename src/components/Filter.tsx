import { useState } from "react";
import type { Pokemon } from "../types/pokemon";
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function Filters({ pokemons, onFilter }: FiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const allTypes = Array.from(
    new Set(
      pokemons.flatMap((pokemon) => pokemon.types.map((t) => t.type.name))
    )
  );

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setSelectedFilters(value);
    applyFilters(value);
  };

  const applyFilters = (filters: string[]) => {
    if (filters.length === 0) {
      onFilter(pokemons);
    } else {
      const filtered = pokemons.filter((pokemon) =>
        pokemon.types.some((t) => filters.includes(t.type.name))
      );
      onFilter(filtered);
    }
  };

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
          MenuProps={MenuProps}
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
