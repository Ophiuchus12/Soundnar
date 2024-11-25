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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchChartAlbums = fetchChartAlbums;
exports.fetchGenres = fetchGenres;
exports.fetchArtistsByGenre = fetchArtistsByGenre;
const axios_1 = __importDefault(require("axios"));
function fetchChartAlbums() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = "https://api.deezer.com/chart/0/albums";
            const response = yield axios_1.default.get(url);
            return response.data;
        }
        catch (err) {
            console.error(err);
            return null;
        }
    });
}
function fetchGenres() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = "https://api.deezer.com/genre";
            const response = yield axios_1.default.get(url);
            return response.data;
        }
        catch (err) {
            console.error(err);
            return null;
        }
    });
}
function fetchArtistsByGenre(genreId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = `https://api.deezer.com/genre/${genreId}/artists`;
            const response = yield axios_1.default.get(url);
            return response.data;
        }
        catch (err) {
            console.error(err);
            return null;
        }
    });
}
