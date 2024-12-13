import express from "express";
import { getChartAlbums, getGenres, getArtistsGenre, getChartArtists, getChartTracks, getSingleAlbum, getSingleArtist, getSingleArtistAlbums, getSearchBar, getSearchArtist } from "../controllers/musicController";

const router = express.Router();

// getchart info

router.get("/chartAll/albums", getChartAlbums);
router.get("/chartAll/artists", getChartArtists);
router.get("/chartAll/tracks", getChartTracks)
router.get("/genres", getGenres)
router.get("/genre/:id/artists", getArtistsGenre);
router.get("/album/:idAlbum", getSingleAlbum);
router.get("/artist/:idArtist", getSingleArtist);
router.get("/artist/:idArtist/albums", getSingleArtistAlbums);
router.get("/search", getSearchBar);
router.get("/search/artist", getSearchArtist);


export default router;