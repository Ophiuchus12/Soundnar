import axios from "axios";

export type chartResponse = {
    data: Album[];
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






export async function fetchChartAlbums() {
    try {
        const url = "https://api.deezer.com/chart/0/albums";
        const response = await axios.get<chartResponse>(url);
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