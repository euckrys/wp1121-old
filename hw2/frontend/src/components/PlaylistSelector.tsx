import { useState } from 'react';

import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';

import useSongs from '@/hooks/useSongs';

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


type PlaylistSelectorProps = {
  selectedIds: string[];
  onSelectChange: (selectedIds: string[]) => void;
  playlistId: string;
}

export default function PlaylistSelector({ onSelectChange, playlistId }: PlaylistSelectorProps) {
  const { playlists } = useSongs();
  const [personName, setPersonName] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;

    const selectedTitles = typeof value === 'string' ? value.split(',') : value;
    const newSelectedIds = playlists
      .filter((playlist) => selectedTitles.includes(playlist.title))
      .map((playlist) => playlist.id);

    setPersonName(selectedTitles);
    onSelectChange(newSelectedIds);
  };

  return (
    <div className="w-full" style={{marginLeft: 'auto'}}>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">select playlist</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="select playlist" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {playlists.map((playlist) => {
            if(playlist.id !== playlistId) {
              return(
                <MenuItem
                  key={playlist.title}
                  value={playlist.title}
                >
                  {playlist.title}
                </MenuItem>
              )
            };
          })}
        </Select>
      </FormControl>
    </div>
  );
}