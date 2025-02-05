import express from "express";
import { playlistCreation, addTrack, deleteTrackPlaylist, deletePlaylist, updatePlaylist, getAllPlaylists, getPlaylistById, addTrackFavorite, deleteTrackFavorite, getFavorites } from "../controllers/playlistController"

const router = express.Router();

router.post('/create', playlistCreation)
router.post('/addTrack', addTrack);
router.post('/deleteTrack', deleteTrackPlaylist);
router.delete('/deletePlaylist/:idPlaylist', deletePlaylist)
router.put('/updatePlaylist/:idPlaylist', updatePlaylist)
router.post('/allPlaylists', getAllPlaylists)
router.get('/getPlaylistById/:idPlaylist', getPlaylistById)
router.post('/addTrackFavorite', addTrackFavorite);
router.post('/deleteTrackFavorite', deleteTrackFavorite);
router.post('/getFavoritePlaylist', getFavorites)

export default router;