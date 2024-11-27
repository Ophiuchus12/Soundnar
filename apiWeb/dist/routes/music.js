"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const musicController_1 = require("../controllers/musicController");
const router = express_1.default.Router();
// getchart info
router.get("/chartAll/albums", musicController_1.getChartAlbums);
router.get("/chartAll/artists", musicController_1.getChartArtists);
router.get("/chartAll/tracks", musicController_1.getChartTracks);
router.get("/genres", musicController_1.getGenres);
router.get("/genre/:id/artists", musicController_1.getArtistsByGenre);
exports.default = router;
