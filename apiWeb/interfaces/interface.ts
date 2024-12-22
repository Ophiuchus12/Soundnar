
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
    id: number; // ID de l'artiste
    name: string; // Nom de l'artiste
    picture: string; // URL de l'image principale
    picture_small: string; // URL de l'image petite
    picture_medium: string; // URL de l'image moyenne
    picture_big: string; // URL de l'image grande
    picture_xl: string; // URL de l'image extra-large
    radio: boolean; // Indique si la radio est disponible pour cet artiste
    tracklist: string; // URL de la liste des pistes principales
    type: string; // Type d'entité (ex. "artist")
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


export interface genreResponse {
    data: Genre[],

}

export interface Genre {
    id: number,
    name: string,
    picture: string,
    picture_small: string,
    picture_medium: string,
    picture_big: string,
    picture_xl: string,
    type: string
}

export interface artistsByGenreResponse {
    data: Artist[];
}


export interface AlbumDetail {
    id: string;
    title: string;
    upc: string;
    link: string;
    share: string;
    cover: string;
    cover_small: string;
    cover_medium: string;
    cover_big: string;
    cover_xl: string;
    md5_image: string;
    genre_id: number;
    genres: {
        data: Genre[];
    };
    label: string;
    nb_tracks: number;
    duration: number;
    fans: number;
    release_date: string;
    record_type: string;
    available: boolean;
    tracklist: string;
    explicit_lyrics: boolean;
    explicit_content_lyrics: number;
    explicit_content_cover: number;
    contributors: Contributor[];
    artist: Artist;
    type: string;
    tracks: {
        data: Track[];
    };
}

export interface GenreData {
    data: {
        id: number;
        name: string;
        picture: string;
        picture_small: string;
        picture_medium: string;
        picture_big: string;
        picture_xl: string;
        type: string;
    }[];
}

export interface Contributor {
    id: number;
    name: string;
    link: string;
    share: string;
    picture: string;
    picture_small: string;
    picture_medium: string;
    picture_big: string;
    picture_xl: string;
    radio: boolean;
    tracklist: string;
    type: string;
}

export interface ArtistTopSongList {
    data: ArtistTopSong[];
}

export interface ArtistTopSong {
    id: number;
    readable: boolean;
    title: string;
    title_short: string;
    title_version: string;
    link: string;
    duration: number;
    rank: number;
    explicit_lyrics: boolean;
    preview: string;
    contributors: Contributor[];
    artist: Artist;
    album: Album;
}


export interface ArtistDetail {
    id: number;
    name: string;
    link: string;
    share: string;
    picture: string;
    picture_small: string;
    picture_medium: string;
    picture_big: string;
    picture_xl: string;
    nb_album: number;
    nb_fan: number;
    radio: boolean;
    tracklist: string;
}

export interface ArtistDetailAlbumList {
    data: ArtistDetailAlbum[];
}


export interface ArtistDetailAlbum {

    id: number;
    title: string;
    link: string;
    share: string;
    cover: string;
    cover_small: string;
    cover_medium: string;
    cover_big: string;
    cover_xl: string;
    md5_image: string;
    genre_id: number;
    fans: number;
    release_date: string;
    record_type: string;
    tracklist: string;
    explicit_lyrics: boolean;
    type: string;

}



export interface DeezerTrack {
    id: number;
    readable: boolean;
    title: string;
    title_short: string;
    title_version: string;
    link: string;
    duration: number;
    rank: number;
    explicit_lyrics: boolean;
    preview: string;
    artist: {
        id: number;
        name: string;
        link: string;
        picture: string;
        picture_small: string;
        picture_medium: string;
        picture_big: string;
        picture_xl: string;
    };
    album: {
        id: number;
        title: string;
        cover: string;
        cover_small: string;
        cover_medium: string;
        cover_big: string;
        cover_xl: string;
    };
    type: string;
}

export interface DeezerSearchResponse {
    data: DeezerTrack[];
    total: number;
    next?: string;
}



export interface ArtistSearch {
    id: number;
    name: string;
    link: string;
    picture: string;
    picture_small: string;
    picture_medium: string;
    picture_big: string;
    picture_xl: string;
    nb_album: number;
    nb_fan: number;
    radio: boolean;
    tracklist: string;
    type: string;
}

export interface ArtistSearchData {
    data: ArtistSearch[];
}


//////////////////////////////////////////////



export type SearchType = "all" | "artist" | "album" | "track" | "playlist";




export interface SearchResult<T> {
    data: T[];
    total: number;
    next?: string;
}

export interface ArtistSearch {
    id: number;
    name: string;
    link: string;
    picture: string;
    picture_small: string;
    picture_medium: string;
    picture_big: string;
    picture_xl: string;
    nb_album: number;
    nb_fan: number;
    radio: boolean;
    tracklist: string;
    type: string;
}


export interface DeezerGlobal {
    id: number;
    readable: boolean;
    title: string;
    title_short: string;
    title_version: string;
    link: string;
    duration: number;
    rank: number;
    explicit_lyrics: boolean;
    preview: string;
    artist: {
        id: number;
        name: string;
        link: string;
        picture: string;
        picture_small: string;
        picture_medium: string;
        picture_big: string;
        picture_xl: string;
    };
    album: {
        id: number;
        title: string;
        cover: string;
        cover_small: string;
        cover_medium: string;
        cover_big: string;
        cover_xl: string;
    };
    type: string;
}


export interface AlbumSearch {
    id: number;
    title: string;
    link: string;
    cover: string;
    cover_small: string;
    cover_medium: string;
    cover_big: string;
    cover_xl: string;
    md5_image: string;
    genre_id: number;
    nb_tracks: number;
    record_type: string; // Typiquement "album"
    tracklist: string;
    explicit_lyrics: boolean;
    artist: Artist; // Association avec l'interface Artist sans radio
    type: string; // Typiquement "album"
}

export interface TrackSearch {
    id: number;
    readable: boolean; // Indique si le morceau est lisible
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
    artist: Artist; // Détails de l'artiste sans radio
    album: {
        id: number;
        title: string;
        cover: string;
        cover_small: string;
        cover_medium: string;
        cover_big: string;
        cover_xl: string;
        md5_image: string;
        tracklist: string;
        type: string;
    };
    type: string; // Typiquement "track"
}

export interface PlaylistSearch {
    id: number;
    title: string;
    public: boolean; // Indique si la playlist est publique
    nb_tracks: number; // Nombre de morceaux dans la playlist
    link: string; // Lien vers la playlist
    picture: string; // Image principale
    picture_small: string;
    picture_medium: string;
    picture_big: string;
    picture_xl: string;
    checksum: string; // Hash pour vérifier l'intégrité
    tracklist: string; // Lien vers les morceaux de la playlist
    creation_date: string; // Date de création (format ISO)
    md5_image: string; // Hash de l'image associée
    picture_type: string; // Typiquement "playlist"
    user: User; // Détails du créateur de la playlist
    type: string; // Typiquement "playlist"
}

export interface User {
    id: number;                   // Identifiant unique de l'utilisateur
    name: string;                 // Nom de l'utilisateur
    tracklist: string;            // URL de la liste des morceaux (flow) de l'utilisateur
    type: string;                 // Type de ressource (e.g., "user")
}