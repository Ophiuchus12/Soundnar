export type ChartAllAlbums = {
    data: Album[];
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


