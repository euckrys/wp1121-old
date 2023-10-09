import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';

type PlaylistPageHeaderRowProps = {
  playlistDialogOnClose: () => void;
}


export default function PlaylistPageHeaderRow( { playlistDialogOnClose }: PlaylistPageHeaderRowProps) {
  return (
    <Box sx={{ flexGrow: 1, height: "80px"}} >
      <AppBar position="static" className='h-full'>
        <Toolbar className='h-full'>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={playlistDialogOnClose}
          >
            <ArrowBackIosOutlinedIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: 'none', sm: 'block' },
              fontSize: '36px',
              fontWeight: 'bold',
              marginTop: '6px',
              fontFamily: 'sans-serif'
            }}
            className="text-white"
          >
            WP Music
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
