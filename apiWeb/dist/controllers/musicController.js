"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChartAlbums = getChartAlbums;
exports.getGenres = getGenres;
exports.getArtistsByGenre = getArtistsByGenre;
const musicServices_1 = require("../services/musicServices");
function getChartAlbums(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const chartData = yield (0, musicServices_1.fetchChartAlbums)();
            if (!chartData) {
                res.status(404).json({ message: "Chart not found" });
                return;
            }
            res.status(200).json(chartData);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erreur lors de la récuếration des données chart" });
        }
    });
}
function getGenres(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const genresData = yield (0, musicServices_1.fetchGenres)();
            if (!genresData) {
                res.status(404).json({ message: "Genres not found" });
                return;
            }
            res.status(200).json(genresData);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erreur lors de la récuération des données genres" });
        }
    });
}
function getArtistsByGenre(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const genreId = parseInt(req.params.id);
            const artistsData = yield (0, musicServices_1.fetchArtistsByGenre)(genreId);
            if (!artistsData) {
                res.status(404).json({ message: "Artists in the genre not found" });
                return;
            }
            res.status(200).json(artistsData);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erreur lors de la récuération des données des artistes par genre" });
        }
    });
}
