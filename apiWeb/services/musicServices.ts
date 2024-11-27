import axios from "axios";

export type chartAlbumResponse = {
    data: Album[];
}

export type chartArtistResponse = {
    data: Artist[];
}

export type chartTracksresponse = {
    data: Track[];
}

export interface Album {
    id: number;
    title: string;
    link: string;
    cover: string;
    cover_small: string;
    cover_medium: string;
    cover_big: string;
    cover_xl: string;
    md5_image: string;
    record_type: string;
    tracklist: string;
    explicit_lyrics: boolean;
    position: number;
    artist: string[];
    type: string;
}

export interface Artist {
    id: number;
    name: string;
    link: string;
    picture: string;
    picture_small: string;
    picture_medium: string;
    picture_big: string;
    picture_xl: string;
    radio: boolean;
    tracklist: string;
    type: string;
}

export interface Track {
    id: number;
    title: string;
    title_short: string;
    title_version: string;
    link: string;
    duration: number;
    rank: number;
    explicit_lyrics: boolean;
    explicit_content_lyrics: number;
    explicit_content_cover: number;
    preview: string;
    md5_image: string;
    position: number;
    artist: Artist; // Référence à l'interface `Artist`
    album: Album;   // Référence à l'interface `Album`
    type: string;   // e.g., "track"
}




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

export interface genreResponse {
    id: number,
    name: string,
    picture: string,
    picture_small: string,
    picture_medium: string,
    picture_big: string,
    picture_xl: string,
    type: string
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


export interface artistsByGenreResponse {
    data: string[];
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