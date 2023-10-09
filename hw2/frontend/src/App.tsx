import { useEffect, useState } from 'react'

import Button from '@mui/material/Button';

import HomepageHeaderRow from "@/components/HomepageHeaderRow";
import Playlist from './components/Playlist';
import NewPlaylistDialog from './components/NewPlaylistDialog';

import useSongs from './hooks/useSongs';

function App() {
  const { playlists, fetchPlaylists, fetchSongs } = useSongs();
  const [newPlaylistDialogOpen, setNewPlaylistDialogOpen] = useState(false);
  const [deleteButtonDisplay, setDeleteButtonDisplay] = useState(false);

  useEffect(() => {
    fetchPlaylists();
    fetchSongs();
  }, [fetchSongs, fetchPlaylists]);

  return (
    <>
      <HomepageHeaderRow/>
      <div className='w-full mt-5 h-24 relative flex flex-row justify-between items-center'>
        <div className="ml-10 text-white text-4xl font-extrabold" style={{fontFamily: 'sans-serif'}}>My Playlists</div>
        <div className='flex items-center'>
          <Button
            variant="contained"
            color="success"
            onClick={() => setNewPlaylistDialogOpen(true)}
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
            onClick={() => setDeleteButtonDisplay(!deleteButtonDisplay)}
            sx={{
              marginRight: '30px',
              backgroundColor: '#2eb050',
              fontWeight: 'bold'
            }}
          >
            {deleteButtonDisplay ? "DONE" : "DELETE"}
          </Button>
        </div>
      </div>
      <main className="mt-8 flex flex-wrap gap-8">
        {playlists.map((playlist) => (
          <Playlist
            key={playlist.id} {...playlist}
            isButtonActive={deleteButtonDisplay}
          />
        ))}
      </main>
      <NewPlaylistDialog
          newPlaylistDialogOpen={newPlaylistDialogOpen}
          newPlaylistDialogOnClose={() => setNewPlaylistDialogOpen(false)}
      />
    </>
  );
}

export default App;
