import { useState, useEffect } from "react";
import { getTypes } from "../services/api";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

interface FiltersProps {
  onFilter: (types: string[]) => void;
}

export default function Filters({ onFilter }: FiltersProps) {
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
    onFilter(selectedFilters);
  }, [selectedFilters]);
  

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
