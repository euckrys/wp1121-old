import {
    createDiary,
    getDiarys,
    updateDiary,
} from "../controllers/diary.js";
import express from "express";

const router = express.Router();

router.get("/", getDiarys);

router.post("/", createDiary);

router.put("/:id", updateDiary);

export default router;