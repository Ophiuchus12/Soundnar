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

export type Album = {
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

export type Artist = {
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
    data: genre[],

}

export interface genre {
    id: number,
    name: string,
    picture: string,
    picture_small: string,
    picture_medium: string,
    picture_big: string,
    picture_xl: string,
    type: string
}




export type AlbumDetail = {
    id: number; // Identifiant unique de l'album
    title: string; // Titre de l'album
    upc: string; // Code-barre de l'album
    link: string; // Lien vers l'album sur Deezer
    share: string; // Lien de partage de l'album
    cover: string; // Lien vers l'image de couverture
    cover_small: string; // Lien vers l'image de couverture (petite taille)
    cover_medium: string; // Lien vers l'image de couverture (taille moyenne)
    cover_big: string; // Lien vers l'image de couverture (grande taille)
    cover_xl: string; // Lien vers l'image de couverture (très grande taille)
    md5_image: string; // Hash MD5 de l'image de couverture
    genre_id: number; // Identifiant du genre principal
    genres: GenreData; // Détails des genres
    label: string; // Label de l'album
    nb_tracks: number; // Nombre de pistes dans l'album
    duration: number; // Durée totale de l'album en secondes
    fans: number; // Nombre de fans de l'album
    release_date: string; // Date de sortie de l'album
    record_type: string; // Type de l'enregistrement (e.g., album, single)
    available: boolean; // Indique si l'album est disponible
    tracklist: string; // Lien vers la liste des pistes
    explicit_lyrics: boolean; // Indique si l'album contient des paroles explicites
    explicit_content_lyrics: number; // Niveau de contenu explicite des paroles (échelle)
    explicit_content_cover: number; // Niveau de contenu explicite de la couverture (échelle)
    contributors: Contributor[]; // Liste des contributeurs
    artist: Artist; // Détails de l'artiste principal
    type: string; // Type de ressource (e.g., "album")
    tracks: Track[]; // Détails des pistes
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