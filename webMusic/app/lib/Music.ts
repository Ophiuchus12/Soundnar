import {
    ChartResponseAlbums,
    ChartResponseArtists,
    ChartResponseTracks,
    ArtistByGenreResponse,
    AlbumDetail,
    genreResponse,
    ArtistDetail,
    ArtistDetailAlbum,
    ArtistSearchData,
    SearchType,
    SearchResult,
    ArtistSearch,
    DeezerGlobal,
    AlbumSearch,
    TrackSearch,
    PlaylistSearch,
    ArtistTopSongList,
    getOneTrackData
} from "~/types";

//const url = "http://localhost:3000"
//const url = "http://46.202.134.250:3000"
const url = "https://www.api.soundnarmusic.fr"


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

/*recuperation top 5 artist songs */

export async function getArtistTopSong(artistId: number): Promise<ArtistTopSongList | null> {
    const URL = `${url}/api/music/artist/${artistId}/topSongs`;
    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Erreur lors de la récupération des données artist top 5 songs');
        return await response.json() as ArtistTopSongList;
    } catch (err) {
        console.error('Erreur lors de la récupération des données artist top 5 songs : ', err);
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
export async function searchGlobal<T extends SearchType>(
    type: T,
    content: string
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
    const encodedContent = encodeURIComponent(content);
    const URL = `${url}/api/music/search/${type}?search=${encodedContent}`;

    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur lors de la recherche (${response.status}): ${response.statusText}`);
        }

        // Cast explicite pour aider TypeScript
        const jsonResponse = await response.json() as
            T extends "all" ? SearchResult<DeezerGlobal> :
            T extends "artist" ? SearchResult<ArtistSearch> :
            T extends "album" ? SearchResult<AlbumSearch> :
            T extends "track" ? SearchResult<TrackSearch> :
            T extends "playlist" ? SearchResult<PlaylistSearch> :
            never;

        return jsonResponse;

    } catch (err) {
        console.error('Erreur lors de la recherche : ', err);
        return null;
    }
}





export async function searchArtist(content: string): Promise<ArtistSearchData | null> {
    const encodedContent = encodeURIComponent(content);  // Assurez-vous que le terme de recherche est correctement encodé
    const URL = `${url}/api/music/search/artist?search=${encodedContent}`;
    //console.log("url: " + URL);
    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Erreur lors de la recherche par artist');
        const jsonResponse = await response.json() as ArtistSearchData;
        //console.log("JSONresponse", jsonResponse);
        return jsonResponse;
    } catch (err) {
        console.error('Erreur lors de la recherche par artist : ', err);
        return null;
    }
}


export async function getTrackById(idTrack: string): Promise<getOneTrackData | null> {
    const URL = `${url}/api/music/track/${idTrack}`;

    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Erreur lors de la récupération des données de la chanson');
        return await response.json() as getOneTrackData;
    } catch (err) {
        console.error('Erreur lors de la récupération des données de la chanson : ', err);
        return null;
    }

}