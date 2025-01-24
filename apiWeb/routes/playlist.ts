import express from "express";
import { playlistCreation, addTrack, deleteTrackPlaylist, deletePlaylist, updatePlaylist } from "../controllers/playlistController"

const router = express.Router();

router.post('/create', playlistCreation)
router.post('/addTrack', addTrack);
router.delete('/deleteTrack', deleteTrackPlaylist);
router.delete('/deletePlaylist/:idPlaylist', deletePlaylist)
router.put('/updatePlaylist/:idPlaylist', updatePlaylist)

export default router;