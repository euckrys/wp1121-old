import {
    createPlaylist,
    getPlaylists,
    getPlaylist,
    updatePlaylist,
    deletePlaylist,
  } from "../controllers/playlists";
  import express from "express";

  const router = express.Router();

  router.get("/", getPlaylists);

  router.get("/:id", getPlaylist);

  router.post("/", createPlaylist);

  router.put("/:id", updatePlaylist);

  router.delete("/:id", deletePlaylist);

  export default router;

