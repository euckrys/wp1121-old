import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

import useSongs from "@/hooks/useSongs";
import type { SongProps } from "./Song";
import { deleteSong } from "@/utils/client";

type ConfirmDeleteDialogProps = {
    confirmDeleteDialogOpen: boolean;
    confirmDeleteDialogOnClose: () => void;
    songs: SongProps[];
    allcheckedSongs: string[];
}



export default function ComfirmDeleteDialog({confirmDeleteDialogOpen, confirmDeleteDialogOnClose, songs, allcheckedSongs} : ConfirmDeleteDialogProps) {
    const { fetchSongs } = useSongs();

    const handleDeleteSongs = async () => {
        allcheckedSongs.forEach( async (id) => {
            console.log(id);
            try {
                await deleteSong(id);
                fetchSongs();
            } catch (error) {

            } finally {
                confirmDeleteDialogOnClose();
            }
        })
    };

    return (
        <Dialog
          open={confirmDeleteDialogOpen}
          onClose={confirmDeleteDialogOnClose}
          sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "500px",  // Set your width here
            },
          },
        }}>
            <DialogTitle sx={{fontSize: '20px', marginTop: '10px'}}>
                Do you sure to delete these songs?
            </DialogTitle>
            <DialogContent className="ml-4 mt-3">
              <ul className="list-disc p-0">
                {allcheckedSongs.map((id) => {
                  const song = songs.find((s) => s.id === id);
                  if (song?.title !== undefined) {
                    console.log(song?.title);
                    return (
                    <li key={id} className="mb-4">
                      {song && (
                        <Typography variant="body2" sx={{fontSize: '18px', marginLeft:'15px'}}>
                          {song.title} - {song.singer}
                        </Typography>
                      )}
                    </li>
                    );
                  }
                })}
              </ul>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDeleteSongs}>DELETE</Button>
                <Button onClick={confirmDeleteDialogOnClose}>CANCEL</Button>
            </DialogActions>
        </Dialog>
    )
}