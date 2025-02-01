export type ChartAllAlbums = {
    data: Album[];
}

export interface ChartResponseAlbums {
    data: Album[]; // Un tableau d'objets de type Album
}
export interface ChartResponseArtists {
    data: Artist[]; // Un tableau d'objets de type Artist
}

export interface ChartResponseTracks {
    data: Track[]; // Un tableau d'objets de type Track
}

export interface ArtistByGenreResponse {
    data: Artist[]; // Tableau des artistes
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
    artist: Artist;
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
    position: number;
    type: string;
}


export interface Track {
    id: string;
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

export interface Playlist {
    id: number;                   // Identifiant unique de la playlist
    title: string;                // Titre de la playlist
    public: boolean;              // Indique si la playlist est publique
    nb_tracks: number;            // Nombre total de morceaux dans la playlist
    link: string;                 // Lien vers la page Deezer de la playlist
    picture: string;              // URL de l'image principale de la playlist
    picture_small: string;        // URL de l'image en petite taille (56x56)
    picture_medium: string;       // URL de l'image en taille moyenne (250x250)
    picture_big: string;          // URL de l'image en grande taille (500x500)
    picture_xl: string;           // URL de l'image en très grande taille (1000x1000)
    checksum: string;             // Somme de contrôle de la playlist
    tracklist: string;            // URL de la liste des morceaux de la playlist
    creation_date: string;        // Date de création de la playlist (format: "YYYY-MM-DD HH:mm:ss")
    md5_image: string;            // MD5 de l'image associée à la playlist
    picture_type: string;         // Type de l'image associée (e.g., "playlist")
    user: User;                   // Référence à l'utilisateur ayant créé la playlist
    type: string;                 // Type de ressource (e.g., "playlist")
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


export interface User {
    id: number;                   // Identifiant unique de l'utilisateur
    name: string;                 // Nom de l'utilisateur
    tracklist: string;            // URL de la liste des morceaux (flow) de l'utilisateur
    type: string;                 // Type de ressource (e.g., "user")
}


export interface Podcast {
    id: number;                   // Identifiant unique du podcast
    title: string;                // Titre du podcast
    description: string;          // Description du podcast
    available: boolean;           // Indique si le podcast est disponible
    fans: number;                 // Nombre de fans (auditeurs abonnés)
    link: string;                 // Lien vers la page Deezer du podcast
    share: string;                // Lien de partage du podcast
    picture: string;              // URL de l'image principale du podcast
    picture_small: string;        // URL de l'image en petite taille (56x56)
    picture_medium: string;       // URL de l'image en taille moyenne (250x250)
    picture_big: string;          // URL de l'image en grande taille (500x500)
    picture_xl: string;           // URL de l'image en très grande taille (1000x1000)
    type: string;                 // Type de ressource (e.g., "podcast")
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

export interface ArtistTopSongList {
    data: ArtistTopSong[];
}

export interface ArtistTopSong {
    id: string;
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


export interface DeezerSearchResponse {
    data: DeezerGlobal[];
    total: number;
    next?: string;
}


export interface ArtistSearchData {
    data: ArtistSearch[];
}



//////////////////////////////////////////////////

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
    id: string;
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
    id: string;
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
    id: string;
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






///////////////////////////////////////////////////////////////////////////////////
//user part 

export interface User {
    idUser: string;
    username: string;
    mdp: string;
}

export interface UserResponse {
    message: string;
    user?: User;
    token?: string;
}


///////////////////////////////////////////////////////////////////////////////////////
//Playlist part

export interface PlaylistPerso {
    idPlaylist: string;
    title: string;
    nbTracks: number;
    duration: number;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    authorId: string;
    songs: TrackPerso[]
}

export interface TrackPerso {
    idTrack: string;
    idTrackDeezer: string;
    title: string;
    duration: number;
    preview: string;
    md5Image: string;
    artistId: number;
    albumId: number;

}

export interface responsePlaylistCreation {
    message: string;
    playlist: PlaylistPerso;
}

export interface addTrackResponse {
    message: string;
}


export interface deleteTrackPlaylistResponse {
    message: string;
}

export interface deletePlaylistResponse {
    message: string;
    playlist: PlaylistPerso;
}

export interface updatePlaylistResponse {
    message: string;
    playlist: PlaylistPerso;
}

export interface playlistAllResponse {
    playlists: PlaylistPerso[];
}

export interface playlistIdResponse {
    playlist: PlaylistPerso;
}

export interface getOneTrackData {
    id: string;
    readable: boolean;
    title: string;
    title_short: string;
    title_version: string;
    isrc: string;
    link: string;
    share: string;
    duration: string;
    track_position: number;
    disk_number: number;
    rank: string;
    release_date: string;
    explicit_lyrics: boolean;
    explicit_content_lyrics: number;
    explicit_content_cover: number;
    preview: string;
    bpm: number;
    gain: number;
    available_countries: string[];
    contributors: Contributor[];
    md5_image: string;
    track_token: string;
    artist: Artist;
    album: Album;
    type: string;
}


export interface addTrackFavoriteResponse { }