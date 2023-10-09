import { useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import PlaylistSelector from './PlaylistSelector';

import useSongs from "@/hooks/useSongs";
import { createSong, updateSong } from "@/utils/client";

type EditSongDialogProps = {
    editSongDialogOpen: boolean;
    editSongDialogOnClose: () => void;
    songId: string;
    title: string;
    singer: string;
    link: string;
    playlistId: string;
}

let CopyDestinationId: string[] = [];

export default function EditSongDialog(props: EditSongDialogProps) {
    const { editSongDialogOpen, editSongDialogOnClose, songId, title, singer, link, playlistId } = props;
    const editTitleTextfieldRef = useRef<HTMLInputElement>(null);
    const editSingerTextfieldRef = useRef<HTMLInputElement>(null);
    const editLinkTextfieldRef = useRef<HTMLInputElement>(null);
    const { fetchSongs } = useSongs();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleSelectChange = (newSelectedIds: string[]) => {
        setSelectedIds(newSelectedIds);
        CopyDestinationId = newSelectedIds;
    };

    const handleUpdateSong = async () => {
        if (editTitleTextfieldRef.current?.value === "") {
            alert("Please enter the song title");
            return;
        }
        if (editSingerTextfieldRef.current?.value === "") {
            alert("Please enter the singer");
            return;
        }
        if (editLinkTextfieldRef.current?.value === "") {
            alert("Please enter the song link");
            return;
        }
        try {
            if (CopyDestinationId.length !== 0) {
                CopyDestinationId.forEach( async (id) => {
                    await createSong({
                        title: editTitleTextfieldRef.current?.value ?? "",
                        singer: editSingerTextfieldRef.current?.value ?? "",
                        link: editLinkTextfieldRef.current?.value ?? "",
                        list_id: id,
                    })
                });
            }
            await updateSong(songId, {
                title: editTitleTextfieldRef.current?.value ?? "",
                singer: editSingerTextfieldRef.current?.value ?? "",
                link: editLinkTextfieldRef.current?.value ?? "",
                list_id: playlistId,
            });
            fetchSongs();
        } catch (error) {
            alert("Error: Failed to update song");
            console.log( (error as Error).message );
        } finally {
            editSongDialogOnClose();
        }
    }

    return (
        <Dialog
          open={editSongDialogOpen}
          onClose={editSongDialogOnClose}
          sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "550px",  // Set your width here
              },
            },
        }}>
            <DialogTitle sx={{fontSize: '28px'}}>Edit the song</DialogTitle>
            <DialogContent>
                <div className="mt-3 mb-5 flex flex-row justify-start content-center">
                    <h4 className="min-w-fit mr-10 text-lg self-center">Song Name:</h4>
                    <TextField
                        inputRef={editTitleTextfieldRef}
                        defaultValue={title}
                        label="Song Name"
                        className="w-full"
                        variant="outlined"
                        sx={{ marginLeft: 'auto' }}
                        autoFocus
                    />
                </div>
                <div className="mb-5 flex flex-row justify-start content-center">
                    <h4 className="min-w-fit mr-20 text-lg self-center">Singer:</h4>
                    <TextField
                        inputRef={editSingerTextfieldRef}
                        defaultValue={singer}
                        label="Song Singer"
                        variant="outlined"
                        className="w-full"
                        sx={{marginLeft: 'auto'}}
                        autoFocus
                    />
                </div>
                <div className="mb-5 flex flex-row justify-start content-center">
                    <h4 className="min-w-fit mr-14 text-lg self-center">Song Link:</h4>
                    <TextField
                        inputRef={editLinkTextfieldRef}
                        defaultValue={link}
                        label="Song Link"
                        variant="outlined"
                        className="w-full"
                        sx={{marginLeft: 'auto'}}
                        autoFocus
                    />
                </div>
                <div className="flex flex-row justify-start content-center">
                    <h4 className="min-w-fit mr-5 text-lg self-center">Copy to Playlists:</h4>
                        <PlaylistSelector
                            selectedIds={selectedIds}
                            onSelectChange={handleSelectChange}
                            playlistId={playlistId}
                        />
                </div>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleUpdateSong}>SAVE</Button>
                <Button onClick={editSongDialogOnClose}>CANCEL</Button>
            </DialogActions>
        </Dialog>
    )
}