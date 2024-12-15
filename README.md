# Soundnar

## Search :

### All :

https://api.deezer.com/search?q=eminem

### Artist :

https://api.deezer.com/search/artist?q=eminem

### Album :

https://api.deezer.com/search/album?q=eminem

### Track :

https://api.deezer.com/search/track?q=eminem

### Playlist :

https://api.deezer.com/search/playlist?q=eminem

## Detail Playlists:

https://api.deezer.com/playlist/908622995

type SearchType = "all" | "artist" | "album" | "track" | "playlist";

interface SearchResult<T> {
data: T[];
total: number;
next?: string;
}

// Définitions des types de retour pour chaque type de recherche
interface Artist {
id: number;
name: string;
picture_medium: string;
}

interface Album {
id: number;
title: string;
cover_medium: string;
}

interface Track {
id: number;
title: string;
preview: string;
}

interface Playlist {
id: number;
title: string;
picture_medium: string;
}

// Définir un mappage entre SearchType et le type de retour
type SearchResultMap = {
all: unknown; // Typage pour toutes les recherches combinées, souvent `unknown`
artist: Artist;
album: Album;
track: Track;
playlist: Playlist;
};

async function searchDeezer<T extends SearchType>(
type: T,
query: string
): Promise<SearchResult<SearchResultMap[T]>> {
const baseUrl = "https://api.deezer.com/search";
const url = type === "all" ? `${baseUrl}?q=${query}` : `${baseUrl}/${type}?q=${query}`;

const response = await fetch(url);

if (!response.ok) {
throw new Error(`Failed to fetch ${type} results`);
}

return response.json();
}

async function main() {
try {
const artistResults = await searchDeezer("artist", "eminem");
console.log("Artists:", artistResults.data);

    const albumResults = await searchDeezer("album", "eminem");
    console.log("Albums:", albumResults.data);

    const trackResults = await searchDeezer("track", "eminem");
    console.log("Tracks:", trackResults.data);

    const playlistResults = await searchDeezer("playlist", "eminem");
    console.log("Playlists:", playlistResults.data);

} catch (error) {
console.error("An error occurred:", error);
}
}

main();
