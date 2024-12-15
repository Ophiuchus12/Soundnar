import { ChartResponseAlbums, ChartResponseArtists, ChartResponseTracks, ArtistByGenreResponse, AlbumDetail, genreResponse, ArtistDetail, ArtistDetailAlbum, DeezerSearchResponse, ArtistSearchData } from "~/types";

const url = "http://localhost:3000"

/*recuperation top 10 albums actu */
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

/* recuperation top 10 artists actu */
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

/*recuperation top 10 tracks */
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



/*recuperation des genres de musique */
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







/*recupereation des artists par genre */
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

/*recuperation des details des albums*/
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

/*recuperation des details des artists */
export async function getArtist(artistId: number): Promise<ArtistDetail | null> {
    const URL = `${url}/api/music/artist/${artistId}`;

    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Erreur lors de la récupération des données artist');
        return await response.json() as ArtistDetail;
    } catch (err) {
        console.error('Erreur lors de la récupération des données artist : ', err);
        return null;
    }
}





/*recuperation des details des albums des artists  */
export async function getArtistAlbums(artistId: number): Promise<ArtistDetailAlbum | null> {
    const URL = `${url}/api/music/artist/${artistId}/albums`;

    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Erreur lors de la récupération des données artist');
        return await response.json() as ArtistDetailAlbum;
    } catch (err) {
        console.error('Erreur lors de la récupération des données artist : ', err);
        return null;
    }
}



/*search by global */

export async function searchGlobal(content: string): Promise<DeezerSearchResponse | null> {
    //console.log("content non code", content);
    const encodedContent = encodeURIComponent(content);  // Assurez-vous que le terme de recherche est correctement encodé
    //console.log("content passé", encodedContent);
    const URL = `${url}/api/music/search?search=${encodedContent}`;
    //console.log("Search1", URL)
    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Erreur lors de la recherche par artist');
        console.log("Search2", response)
        const jsonResponse = await response.json() as DeezerSearchResponse;
        console.log("return", jsonResponse);
        return jsonResponse;


    } catch (err) {
        console.error('Erreur lors de la recherche par artist : ', err);
        return null;
    }
}


export async function searchArtist(content: string): Promise<ArtistSearchData | null> {
    const encodedContent = encodeURIComponent(content);  // Assurez-vous que le terme de recherche est correctement encodé
    const URL = `${url}/api/music/search/artist?search=${encodedContent}`;
    console.log("url: " + URL);
    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Erreur lors de la recherche par artist');
        const jsonResponse = await response.json() as ArtistSearchData;
        console.log("JSONresponse", jsonResponse);
        return jsonResponse;
    } catch (err) {
        console.error('Erreur lors de la recherche par artist : ', err);
        return null;
    }
}