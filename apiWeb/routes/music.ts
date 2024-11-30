import express from "express";
import { getChartAlbums, getGenres, getArtistsGenre, getChartArtists, getChartTracks, getSingleAlbum } from "../controllers/musicController";

const router = express.Router();

// getchart info

router.get("/chartAll/albums", getChartAlbums);
router.get("/chartAll/artists", getChartArtists);
router.get("/chartAll/tracks", getChartTracks)
router.get("/genres", getGenres)
router.get("/genre/:id/artists", getArtistsGenre);
router.get("/album/:idAlbum", getSingleAlbum);

export default router;