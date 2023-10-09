import { useEffect, useRef, useState } from "react";

import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Input from "@mui/material/Input";
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';

import PlaylistPageHeaderRow from "./PlaylistPageHeaderRow"
import NewSongDialog from "./NewSongDialog";
import type { SongProps } from "./Song";
import useSongs from "@/hooks/useSongs";
import { updatePlaylist } from "@/utils/client";
import Song from "./Song";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import { TextField } from "@mui/material";

type PlaylistDialogProps = {
  playlistDialogOpen: boolean;
  playlistDialogOnClose: () => void;
  title: string;
  description: string;
  songs: SongProps[];
  id: string;
};

let allcheckedSongs: string[] = [];

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export default function PlaylistDialog(props: PlaylistDialogProps) {
  const {playlistDialogOpen, playlistDialogOnClose, title, description, songs, id} = props;
  const [newSongDialogOpen, setNewSongDialogOpen] = useState(false);
  const [checkedSongs, setCheckedSongs] = useState<string[]>([]);
  const [checkedAll, setCheckedAll] = useState(false);

  const [edittingTitle, setedittingTitle] = useState(false);
  const [edittingDescription, setEdittingDescription] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);

  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);

  const { fetchPlaylists } = useSongs();

  const handleUpdateTitle = async () => {
    if (!titleInputRef.current) return;

    const newTitle = titleInputRef.current.value;
    if( newTitle === "") {
      alert("Please enter the playlist name");
    }
    else if( newTitle !== title) {
      try {
        await updatePlaylist(id, { title: newTitle })
        fetchPlaylists();
      } catch (error) {
        alert("Error: failed to update playlist title");
      }
    }
    setedittingTitle(false);
  };

  const handleUpdateDescription = async () => {
    if (!descriptionInputRef.current) return;

    const newDescription = descriptionInputRef.current.value;
    if( newDescription === "") {
      alert("Please enter the playlist description");
    }
    else if( newDescription !== description) {
      try {
        await updatePlaylist(id, { description: newDescription })
        fetchPlaylists();
      } catch (error) {
        alert("Error: failed to update playlist description");
      }
    }
    setEdittingDescription(false);
  }



  const handleDeleteConfirming = async () => {
    if (allcheckedSongs.length === 0){
      alert("Please select some song to delete");
      setCheckedAll(false);
      return;
    }
    setConfirmDeleteDialogOpen(true)
  };

  useEffect(() => {
    allcheckedSongs.length = 0;
    allcheckedSongs.push(...checkedSongs);
  }, [checkedSongs]);

  const handleIsCheckedAll= () => {
    setCheckedAll((prev) => !prev);
    setCheckedSongs(checkedAll ? [] : songs.map((song) => song.id));
  }

  const handleCheckboxChange = (songId: string, isChecked: boolean) => {
    setCheckedSongs( (prevCheckedSongs) => {
      const newCheckedSongs = isChecked
        ? [...prevCheckedSongs, songId]
        : prevCheckedSongs.filter((id) => id !== songId)

      return newCheckedSongs;
    })
    console.log(allcheckedSongs);
  }

  return (
    <div>
      <Dialog
        fullScreen
        open={playlistDialogOpen}
        onClose={playlistDialogOnClose}
      >
        <div className="h-24">
          <PlaylistPageHeaderRow playlistDialogOnClose={playlistDialogOnClose} />
        </div>
        <div className="flex flex-col">
          <div className="ml-20 mt-12 flex flex-row">
            <Box
              component="img"
              sx={{
                objectFit: 'cover',
                height: 240,
                width: 240,
                maxHeight: { xs: 240, md: 240 },
                maxWidth: { xs: 240, md: 240 },
              }}
              className="ml-10 rounded-2xl"
              alt="The Playlist cover"
              src="https://i.pinimg.com/564x/cf/c9/04/cfc904ede7ec44408ab0a162a20394e3.jpg"
            />
            <div className="ml-20 w-full">
              <div className="flex flex-col gap-4">
                {edittingTitle ? (
                  <ClickAwayListener onClickAway={handleUpdateTitle}>
                    <Input
                      autoFocus
                      defaultValue={title}
                      className="grow w-fit"
                      placeholder="Enter a new title for this playlist..."
                      sx={{ fontSize: "2rem", fontWeight: "bold"}}
                      inputRef={titleInputRef}
                    />
                  </ClickAwayListener>
                ) : (
                  <button
                    onClick={() => setedittingTitle(true)}
                    className="w-fit rounded-md p-2 hover:bg-white/10"
                  >
                    <p className="text-start" style={{ fontSize: "2.4rem", fontWeight: "bold"}}>
                      {title}
                    </p>
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-4">
                {edittingDescription ? (
                  <ClickAwayListener onClickAway={handleUpdateDescription}>
                    <TextField
                      autoFocus
                      multiline
                      rows={5}
                      defaultValue={description}
                      className="grow"
                      placeholder="Enter a new description for this playlist..."
                      sx={{ fontSize: "1.5rem", color: "gray", marginRight: "30px"}}
                      inputRef={descriptionInputRef}
                    />
                  </ClickAwayListener>
                ) : (
                  <button
                    onClick={() => setEdittingDescription(true)}
                    className="w-fit rounded-md p-2 hover:bg-white/10"
                  >
                    <Typography
                      className="text-start"
                      variant="h5"
                      sx={{
                        color: "gray",
                        whiteSpace: "pre-line",
                        overflowY: 'auto', // Hide overflowing content
                        maxHeight: '7.5rem'
                      }}>
                      {description}
                    </Typography>
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-end">
            <Button
              variant="contained"
              color="success"
              onClick={() => setNewSongDialogOpen(true)}
              sx={{
                marginRight: '15px',
                backgroundColor: '#2eb050',
                fontWeight: 'bold'
              }}
            >
              ADD
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleDeleteConfirming}
              sx={{
                marginRight: '150px',
                backgroundColor: '#2eb050',
                fontWeight: 'bold'
              }}
            >
              DELETE
            </Button>
          </div>
        </div>
        <div className='grid grid-cols-12 items-center justify-start container mx-auto mt-4'>
               <Checkbox
                 {...label}
                 checked={checkedAll}
                 onChange={handleIsCheckedAll}
                 className="justify-self-start content-center col-span-1"
              />
              <h4 className='text-xl col-span-3 font-black'>Song</h4>
              <h4 className='text-xl col-span-2 font-black'>Singer</h4>
              <h4 className='text-xl col-span-5 font-black'>link</h4>
              <hr className='col-span-12 my-2 border-gray-500' />
        </div>
        <div className="flex flex-col">
            {songs.map((song) => (
              <Song
                key={song.id}
                {...song}
                isChecked={checkedSongs.includes(song.id)}
                onCheckboxChange={handleCheckboxChange}
              />
            ))}
        </div>
        <NewSongDialog
          newSongDialogOpen={newSongDialogOpen}
          newSongDialogOnClose={() => setNewSongDialogOpen(false)}
          listId={id}
        />
        <ConfirmDeleteDialog
          confirmDeleteDialogOpen={confirmDeleteDialogOpen}
          confirmDeleteDialogOnClose={() => setConfirmDeleteDialogOpen(false)}
          songs={songs}
          allcheckedSongs={allcheckedSongs}
        />
      </Dialog>
    </div>
  );
}