import { useRef } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import useSongs from "@/hooks/useSongs";
import { createPlaylist } from "@/utils/client";

type NewPlaylistDialogProps = {
  newPlaylistDialogOpen: boolean;
  newPlaylistDialogOnClose: () => void;
};

export default function NewPlaylistDialog({ newPlaylistDialogOpen, newPlaylistDialogOnClose }: NewPlaylistDialogProps) {
  const titleTextfieldRef = useRef<HTMLInputElement>(null);
  const descriptionTextfieldRef = useRef<HTMLInputElement>(null);
  const { playlists, fetchPlaylists } = useSongs();

  const handleAddPlaylist = async () => {
    let isRepeat = false;
    playlists.forEach((playlist) => {
      if (playlist.title === titleTextfieldRef.current?.value ?? "")
        isRepeat = true;
    })
    if (isRepeat) {
      alert("The playlist name is repeat. Please choose a new name");
      return;
    }
    if (titleTextfieldRef.current?.value === "") {
      alert("Please enter the playlist title");
      return;
    }
    if (descriptionTextfieldRef.current?.value === "") {
      alert("Please enter the playlist description");
      return;
    }
    try {
      await createPlaylist({
        title: titleTextfieldRef.current?.value ?? "",
        description: descriptionTextfieldRef.current?.value ?? "",
      });
      fetchPlaylists();
    } catch (error) {
      alert("Error: Failed to create list");
    } finally {
      newPlaylistDialogOnClose();
    }
  };

  return (
    <Dialog
      open={newPlaylistDialogOpen}
      onClose={newPlaylistDialogOnClose}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "700px",  // Set your width here
          },
        },
      }}>
      <DialogTitle sx={{fontSize: '28px'}}>Add a playlist</DialogTitle>
      <DialogContent>
        <h4 className="mr-20 mb-3 w-full text-lg">Playlist Name:</h4>
        <TextField
          inputRef={titleTextfieldRef}
          label="Playlist Name"
          variant="outlined"
          className="w-full"
          autoFocus
        />
        <h4 className="mt-5 mr-10 w-full text-lg">Playlist Description:</h4>
        <TextField
          inputRef={descriptionTextfieldRef}
          label="Playlist description"
          variant="outlined"
          sx={{ mt: 2 }}
          className="w-full"
          autoFocus
          multiline
          rows={7}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddPlaylist}>add</Button>
        <Button onClick={newPlaylistDialogOnClose}>cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
