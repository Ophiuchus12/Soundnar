import express from "express";
import { getChartAlbums, getGenres, getArtistsGenre, getChartArtists, getChartTracks } from "../controllers/musicController";

const router = express.Router();

// getchart info

router.get("/chartAll/albums", getChartAlbums);
router.get("/chartAll/artists", getChartArtists);
router.get("/chartAll/tracks", getChartTracks)
router.get("/genres", getGenres)
router.get("/genre/:id/artists", getArtistsGenre);

export default router;