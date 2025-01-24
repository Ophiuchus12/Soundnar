import express from "express";
import { playlistCreation, addTrack, deleteTrackPlaylist, deletePlaylist } from "../controllers/playlistController"

const router = express.Router();

router.post('/create', playlistCreation)
router.post('/addTrack', addTrack);
router.delete('/deleteTrack', deleteTrackPlaylist);
router.delete('/deletePlaylist/:idPlaylist', deletePlaylist)

export default router;