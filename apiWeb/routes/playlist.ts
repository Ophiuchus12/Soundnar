import express from "express";
import { playlistCreation, addTrack, deleteTrackPlaylist, deletePlaylist, updatePlaylist, getAllPlaylists, getPlaylistById } from "../controllers/playlistController"

const router = express.Router();

router.post('/create', playlistCreation)
router.post('/addTrack', addTrack);
router.delete('/deleteTrack', deleteTrackPlaylist);
router.delete('/deletePlaylist/:idPlaylist', deletePlaylist)
router.put('/updatePlaylist/:idPlaylist', updatePlaylist)
router.post('/allPlaylists', getAllPlaylists)
router.get('/getPlaylistById/:idPlaylist', getPlaylistById)

export default router;