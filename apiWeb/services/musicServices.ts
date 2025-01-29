import axios from "axios";
import { chartAlbumResponse, chartArtistResponse, chartTracksresponse, genreResponse, artistsByGenreResponse, AlbumDetail, ArtistDetail, ArtistDetailAlbumList, DeezerSearchResponse, ArtistSearchData, SearchResult, DeezerGlobal, ArtistSearch, AlbumSearch, TrackSearch, PlaylistSearch, SearchType, ArtistTopSongList, getOneTrackData } from '../interfaces/interface'





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

export async function fetchTopSongArtist(artistId: number) {
    try {
        const url = `https://api.deezer.com/artist/${artistId}/top`;
        const response = await axios.get<ArtistTopSongList>(url);
        return response.data;
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

export async function fetchSearchData<T extends SearchType>(
    type: T,
    searchData: string
): Promise<
    | (T extends "all"
        ? SearchResult<DeezerGlobal>
        : T extends "artist"
        ? SearchResult<ArtistSearch>
        : T extends "album"
        ? SearchResult<AlbumSearch>
        : T extends "track"
        ? SearchResult<TrackSearch>
        : T extends "playlist"
        ? SearchResult<PlaylistSearch>
        : never)
    | null
> {

    const baseUrl = "https://api.deezer.com/search";
    const encodedSearchData = encodeURIComponent(searchData);
    const url = type === "all"
        ? `${baseUrl}?q=${encodedSearchData}`
        : `${baseUrl}/${type}?q=${encodedSearchData}`;

    try {
        console.log("URL appelée :", url);

        // Effectuer la requête à l'API Deezer
        const response = await axios.get(url);

        // Cast explicite basé sur le type conditionnel
        const data = response.data as T extends "all"
            ? SearchResult<DeezerGlobal>
            : T extends "artist"
            ? SearchResult<ArtistSearch>
            : T extends "album"
            ? SearchResult<AlbumSearch>
            : T extends "track"
            ? SearchResult<TrackSearch>
            : T extends "playlist"
            ? SearchResult<PlaylistSearch>
            : never;

        console.log("Données récupérées :", data);

        return data;
    } catch (err) {
        console.error("Erreur dans fetchSearchData :", err);
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


export async function fetchTrack(idTrack: number): Promise<getOneTrackData | null> {
    try {
        const url = `https://api.deezer.com/track/${idTrack}`;
        const response = await axios.get<getOneTrackData>(url);
        return response.data;
    } catch (err) {
        console.error('Erreur dans fetchTrack:', err);
        return null;
    }
}