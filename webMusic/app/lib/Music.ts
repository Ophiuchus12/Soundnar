import { Album, Artist, ChartResponseAlbums, ChartResponseArtists, ChartResponseTracks, ArtistByGenreResponse, Track, AlbumDetail, genreResponse } from "~/types";

const url = "http://localhost:3000"


export async function getChartAlbums(): Promise<ChartResponseAlbums | null> {
    const URL = `${url}/api/music/chartAll/albums`;                  //categorie genre 0 -> all

    try {
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) throw new Error('Erreur dans la récupération des données chart');
        return await response.json() as ChartResponseAlbums;
    } catch (e) {
        console.error('Erreur lors de la récupération des données chart : ', e);
        return null;
    }
}

export async function getChartArtists(): Promise<ChartResponseArtists | null> {
    const URL = `${url}/api/music/chartAll/artists`;                  //categorie genre 0 -> all
    try {
        const reponse = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!reponse.ok) throw new Error('Erreur dans la récupération des données chart');
        return await reponse.json() as ChartResponseArtists;
    } catch (e) {
        console.error('Erreur lors de la récupération des données chart : ', e);
        return null;
    }
}

export async function getChartTracks(): Promise<ChartResponseTracks | null> {
    const URL = `${url}/api/music/chartAll/tracks`;
    try {
        const reponse = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (!reponse.ok) throw new Error('Erreur dans la récupération des données chart');
        return await reponse.json() as ChartResponseTracks;
    } catch (err) {
        console.error('Erreur lors de la récupération des données chart : ', err);
        return null;
    }
}




export async function getGenre(): Promise<genreResponse | null> {
    const URL = `${url}/api/music/genres`;
    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Erreur lors de la récupération des données genre');
        return await response.json() as genreResponse;
    } catch (e) {
        console.error('Erreur lors de la récupération des données genre : ', e);
        return null;
    }
}








export async function getArtistsByGenre(genreId: number): Promise<ArtistByGenreResponse | null> {
    const URL = `${url}/api/music/genre/${genreId}/artists`;

    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (!response.ok) throw new Error('Erreur lors de la récupération des données artistes par genre');
        return await response.json() as ArtistByGenreResponse;
    } catch (err) {
        console.error('Erreur lors de la récupération des données artistes par genre : ', err);
        return null;
    }
}


export async function getAlbum(albumId: number): Promise<AlbumDetail | null> {
    const URL = `${url}/api/music/album/${albumId}`;

    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (!response.ok) throw new Error('Erreur lors de la récupération des données album');
        return await response.json() as AlbumDetail;
    } catch (err) {
        console.error('Erreur lors de la récupération des données album : ', err);
        return null;
    }
}