import { useRef } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import useSongs from "@/hooks/useSongs";
import { createSong } from "@/utils/client";

type NewSongDialogProps = {
    newSongDialogOpen: boolean;
    newSongDialogOnClose: () => void;
    listId: string;
};

export default function NewSongDialog({ newSongDialogOpen, newSongDialogOnClose, listId }: NewSongDialogProps) {
    const titleTextfieldRef = useRef<HTMLInputElement>(null);
    const singerTextfieldRef = useRef<HTMLInputElement>(null);
    const linkTextfieldRef = useRef<HTMLInputElement>(null);
    const { playlists, fetchSongs } = useSongs();

    const handleAddSong = async () => {
      let isRepeat = false;
      playlists.forEach((playlist) => {
        playlist.songs.forEach((song) => {
          if (song.title === titleTextfieldRef.current?.value && song.playlistId === listId)
            isRepeat = true;
        })
      })
      if (isRepeat) {
        alert("The Song is repeat");
        return;
      }
      if (titleTextfieldRef.current?.value === "") {
        alert("Please enter the song Title");
        return;
      }
      if (singerTextfieldRef.current?.value === "") {
        alert("Please enter the singer");
        return;
      }
      if (linkTextfieldRef.current?.value === "") {
        alert("Please enter the link of the song");
        return;
      }
      try {
        await createSong({
            title: titleTextfieldRef.current?.value ?? "",
            singer: singerTextfieldRef.current?.value ?? "",
            link: linkTextfieldRef.current?.value ?? "",
            list_id: listId,
        });
        fetchSongs();
      } catch (error) {
        alert("Error: Failed to add song");
        console.log( (error as Error).message );
      } finally {
        newSongDialogOnClose();
      }
    };

    return (
        <Dialog
          open={newSongDialogOpen}
          onClose={newSongDialogOnClose}
          sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "500px",  // Set your width here
              },
            },
          }}>
            <DialogTitle sx={{fontSize: '28px'}}>Add a song</DialogTitle>
            <DialogContent>
              <div className="mt-3 mb-5 flex flex-row justify-start content-center">
                <h4 className="min-w-fit mr-10 text-lg self-center">Song Name:</h4>
                <TextField
                  inputRef={titleTextfieldRef}
                  label="Song Name"
                  className="w-full"
                  variant="outlined"
                  sx={{marginLeft: 'auto'}}
                  autoFocus
                />
              </div>
              <div className="mb-5 flex flex-row justify-start content-center">
                <h4 className="min-w-fit mr-20 text-lg self-center">Singer:</h4>
                <TextField
                  inputRef={singerTextfieldRef}
                  label="Song Singer"
                  variant="outlined"
                  className="w-full"
                  sx={{marginLeft: 'auto'}}
                  autoFocus
                />
              </div>
              <div className="flex flex-row justify-start content-center">
                <h4 className="min-w-fit mr-14 text-lg self-center">Song Link:</h4>
                <TextField
                  inputRef={linkTextfieldRef}
                  label="Song Link"
                  variant="outlined"
                  className="w-full"
                  sx={{marginLeft: 'auto'}}
                  autoFocus
                />
              </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleAddSong}>add</Button>
                <Button onClick={newSongDialogOnClose}>cancel</Button>
            </DialogActions>
        </Dialog>
    );
};