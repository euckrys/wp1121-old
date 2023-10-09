import {
    createSong,
    deleteSong,
    getSong,
    getSongs,
    updateSong,
} from "../controllers/songs";
import express from "express";

const router = express.Router();

router.get("/", getSongs);

router.get("/:id", getSong);

router.post("/", createSong);

router.put("/:id", updateSong);

router.delete("/:id", deleteSong);

export default router;