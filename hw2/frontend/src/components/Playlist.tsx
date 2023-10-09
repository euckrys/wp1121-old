import { useState } from "react";

import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

import type { SongProps } from "./Song";
import { deletePlaylist } from "@/utils/client";
import useSongs from "@/hooks/useSongs";
import PlaylistDialog from "./PlaylistDialog";

export type PlaylistProps = {
    id: string;
    title: string;
    description: string;
    songs: SongProps[];
    isButtonActive: boolean;
};


export default function Playlist({ id, title, description, songs, isButtonActive }: PlaylistProps) {
    const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
    const { fetchPlaylists } = useSongs();

    const handleClickOpen = () => {
        setPlaylistDialogOpen(true);
    };

    const handleDelete = async () => {
      try {
        await deletePlaylist(id);
        fetchPlaylists();
      } catch (error) {
        alert("Error: Failed to delete playlist");
      }
    };

    return (
      <div className="relative w-fit ml-10 mr-30">
        <Box
          component="img"
          sx={{
            objectFit: 'cover',
            height: 240,
            width: 240,
            maxHeight: { md: 240, xl: 240 },
            maxWidth: { md: 240, xl: 240 },
          }}
          alt="The Playlist cover"
          src="https://i.pinimg.com/564x/cf/c9/04/cfc904ede7ec44408ab0a162a20394e3.jpg"
          onClick={handleClickOpen}
          className="cursor-pointer rounded-2xl"
        />
        <h4 className="ml-3 mt-2 text-green-500 font-bold">{songs.length} songs</h4>
        <h4 className="ml-3 text-white font-black text-lg">{title}</h4>
        {isButtonActive && (
          <IconButton onClick={handleDelete} sx={{ position: 'absolute', top: 0, right: 0, marginTop: '-1.4rem', marginRight: '-1.4rem' }}>
            <RemoveCircleIcon sx={{ color: 'red', fontSize: '32px'}}/>
          </IconButton>
        )}
        <PlaylistDialog
          playlistDialogOpen={playlistDialogOpen}
          playlistDialogOnClose={() => setPlaylistDialogOpen(false)}
          title={title}
          description={description}
          songs={songs}
          id={id}
        />
      </div>
    );
}

