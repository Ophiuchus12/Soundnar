import express from "express";
import { playlistCreation, addTrack } from "../controllers/playlistController"

const router = express.Router();

router.post('/create', playlistCreation)
router.post('/addTrack', addTrack);

export default router;