import express from "express";
import { getChartAlbums, getGenres, getArtistsByGenre } from "../controllers/musicController";

const router = express.Router();

// getchart info

router.get("/chartAll/albums", getChartAlbums);
router.get("/genres", getGenres)
router.get("/genre/:id/artists", getArtistsByGenre);

export default router;