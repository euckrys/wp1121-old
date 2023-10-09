import React from "react";
import ReactDOM from "react-dom/client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import App from './App.tsx';
import { SongProvider } from "./hooks/useSongs.tsx";
import './index.css';

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <SongProvider>
        <CssBaseline />
        <App />
      </SongProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
