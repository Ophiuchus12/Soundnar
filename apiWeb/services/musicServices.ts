import axios from "axios";
import { chartAlbumResponse, chartArtistResponse, chartTracksresponse, genreResponse, artistsByGenreResponse, AlbumDetail, ArtistDetail, ArtistDetailAlbumList, DeezerSearchResponse, ArtistSearchData } from '../interfaces/interface'





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

export async function fetchArtist(artistId: number) {
    try {
        const url = `https://api.deezer.com/artist/${artistId}`;
        const reponse = await axios.get<ArtistDetail>(url);
        return reponse.data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function fetchArtistAlbum(artistId: number) {
    try {
        const url = `https://api.deezer.com/artist/${artistId}/albums`;
        const reponse = await axios.get<ArtistDetailAlbumList>(url);
        return reponse.data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function fetchSearchData(searchData: string): Promise<DeezerSearchResponse | null> {
    try {
        const url = `https://api.deezer.com/search?q=${searchData}`;
        console.log(url);
        console.log("Avant la requête à Deezer");
        const response = await axios.get<DeezerSearchResponse>(url);
        console.log("Après la requête à Deezer", response.data);

        return response.data;
    } catch (err) {
        console.error('Erreur dans fetchSearchData :', err);
        return null;
    }
}

export async function fetchSearchArtist(searchData: string): Promise<ArtistSearchData | null> {
    try {
        const url = `https://api.deezer.com/search/artist?q=${searchData}`;
        const response = await axios.get<ArtistSearchData>(url);
        return response.data;
    } catch (err) {
        console.error('Erreur dans fetchSearchArtist :', err);
        return null;
    }
}


