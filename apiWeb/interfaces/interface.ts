
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

export interface artistsByGenreResponse {
    data: Artist[];
}


export interface AlbumDetail {
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