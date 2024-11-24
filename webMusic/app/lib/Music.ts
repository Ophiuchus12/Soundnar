const url = "http://localhost:3000"





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
    record_type: string; // e.g., "album"
    tracklist: string;
    explicit_lyrics: boolean;
    position: number;
    artist: Artist;
    type: string; // e.g., "album"
}

export interface Artist {
    id: number;                   // Identifiant unique de l'artiste
    name: string;                 // Nom de l'artiste
    link: string;                 // Lien vers la page Deezer de l'artiste
    picture: string;              // URL de l'image principale de l'artiste
    picture_small: string;        // URL de l'image en petite taille (56x56)
    picture_medium: string;       // URL de l'image en taille moyenne (250x250)
    picture_big: string;          // URL de l'image en grande taille (500x500)
    picture_xl: string;           // URL de l'image en très grande taille (1000x1000)
    radio: boolean;               // Indique si l'artiste a une radio disponible
    tracklist: string;            // URL de la liste des morceaux populaires de l'artiste
    position: number;             // Position de l'artiste dans une liste (si applicable)
    type: string;                 // Type de ressource (e.g., "artist")
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

export interface chartResponse {
    tracks: {
        data: Track[];
        total: number;
    };
    albums: {
        data: Album[];
        total: number;
    };
    artists: {
        data: Artist[];
        total: number;
    };
    playlists: {
        data: Playlist[];
        total: number;
    };
    podcasts: {
        data: Podcast[];
        total: number;
    };
}

export async function getChart(): Promise<chartResponse | null> {
    const URL = `${url}/api/music/chart`;

    try {
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) throw new Error('Erreur dans la récupération des données chart');
        return await response.json() as chartResponse;
    } catch (e) {
        console.error('Erreur lors de la récupération des données chart : ', e);
        return null;
    }
}