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
    record_type: string; // e.g., "album"
    tracklist: string;
    explicit_lyrics: boolean;
    position: number;
    artist: string[];
    type: string; // e.g., "album"
}

