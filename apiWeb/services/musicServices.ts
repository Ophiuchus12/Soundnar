import axios from "axios";
import { chartAlbumResponse, chartArtistResponse, chartTracksresponse, genreResponse, artistsByGenreResponse, AlbumDetail } from '../interfaces/interface'





export async function fetchChartAlbums() {
    try {
        const url = "https://api.deezer.com/chart/0/albums";
        const response = await axios.get<chartAlbumResponse>(url);
        return response.data;
    } catch (err) {
        console.error(err);
        return null;
    }

}

export async function fetchChartArtists() {
    try {
        const url = "https://api.deezer.com/chart/0/artists";
        const response = await axios.get<chartArtistResponse>(url);
        return response.data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function fetchChartTracks() {
    try {
        const url = "https://api.deezer.com/chart/0/tracks";
        const response = await axios.get<chartTracksresponse>(url);
        return response.data;
    } catch (err) {
        console.error(err);
        return null;
    }
}



export async function fetchGenres() {
    try {
        const url = "https://api.deezer.com/genre";
        const response = await axios.get<genreResponse>(url);
        return response.data;
    } catch (err) {
        console.error(err);
        return null;
    }
}




export async function fetchArtistsByGenre(genreId: number) {
    try {
        const url = `https://api.deezer.com/genre/${genreId}/artists`;
        const response = await axios.get<artistsByGenreResponse>(url);
        return response.data;
    } catch (err) {
        console.error(err);
        return null;
    }
}



export async function fetchAlbum(albumId: number) {
    try {
        const url = `https://api.deezer.com/album/${albumId}`;
        const response = await axios.get<AlbumDetail>(url);
        return response.data;
    } catch (err) {
        console.error(err);
        return null;
    }
}