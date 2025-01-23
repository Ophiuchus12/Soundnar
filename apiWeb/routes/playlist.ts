import express from "express";
import { playlistCreation, addTrack, deleteTrackPlaylist } from "../controllers/playlistController"

const router = express.Router();

router.post('/create', playlistCreation)
router.post('/addTrack', addTrack);
router.delete('/deleteTrack', deleteTrackPlaylist);

export default router;