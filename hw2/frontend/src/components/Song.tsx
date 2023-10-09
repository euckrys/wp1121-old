import { ChangeEvent, useState } from 'react';

import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import EditSongDialog from './EditSongDialog';

export type SongProps = {
    id: string;
    title: string;
    singer: string;
    link: string;
    playlistId: string;
    isChecked: boolean,
    onCheckboxChange: (songId: string, isChecked: boolean) => void
};

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export default function Song(
    { id, title, singer, link, playlistId, isChecked, onCheckboxChange }: SongProps) {
    const [editSongDialogOpen, setEditSongDialogOpen] = useState(false);

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        onCheckboxChange(id, event.target.checked);
    };

    return (
        <div className='grid grid-cols-12 items-center justify-start container mx-auto'>
          <Checkbox
            {...label}
            checked={isChecked}
            onChange={handleCheckboxChange}
            className='justify-self-start content-center col-span-1'
          />
          <h4 className='text-xl text-gray-200 col-span-3 overflow-hidden truncate'>{title}</h4>
          <h4 className='text-xl text-gray-200 col-span-2 overflow-hidden truncate'>{singer}</h4>
          <h4 className='text-xl text-gray-200 col-span-5 overflow-hidden'><a href={link} target='_blank' className='truncate'>{link}</a></h4>
          <IconButton
            onClick={() => setEditSongDialogOpen(true)}
            className='content-center col-span-1'
          >
            <EditOutlinedIcon />
          </IconButton>
          <hr className='col-span-12 my-2 border-gray-500'/>
          <EditSongDialog
            editSongDialogOpen={editSongDialogOpen}
            editSongDialogOnClose={() => setEditSongDialogOpen(false)}
            songId={id}
            title={title}
            singer={singer}
            link={link}
            playlistId={playlistId}
          />
        </div>
      );
}