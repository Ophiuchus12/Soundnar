import { addTrackResponse, deleteTrackPlaylistResponse, responsePlaylistCreation, deletePlaylistResponse, updatePlaylistResponse, playlistAllResponse, playlistIdResponse, addTrackFavoriteResponse, deleteTrackFavoriteResponse, getFavoriteResponse } from "~/types";

//const url = "http://localhost:3000"
//const url = "http://46.202.134.250:3000"
const url = "https://www.api.soundnarmusic.fr"


export async function createPlaylist(
    title: string,
    authorId: string
): Promise<responsePlaylistCreation | { error: string }> {
    const URL = `${url}/api/playlist/create`;
    const body = { title, authorId };

    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message };
        }

        const data = await response.json();
        return data as responsePlaylistCreation;
    } catch (error) {
        console.error("Erreur dans la création d'une playlist :", error);

        return { error: "Erreur réseau ou interne lors de la création de la playlist." };
    }
}

export async function addTrack(idPlaylist: string, idTrack: string): Promise<addTrackResponse | null> {
    const URL = `${url}/api/playlist/addTrack`;
    const body = { idPlaylist, idTrack };
    //console.log("body", body);
    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        if (!response.ok) throw new Error("Erreur lors de l'ajout de la piste à la playliste");
        return await response.json() as addTrackResponse;
    } catch (error) {
        console.error("Erreur dans l'ajout d'une piste à une playliste", error);
        return null;
    }
}

export async function deleteTrackPlaylist(idPlaylist: string, idTrack: string): Promise<deleteTrackPlaylistResponse | null> {
    const URL = `${url}/api/playlist/deleteTrack`;
    const body = { idPlaylist, idTrack };
    //console.log("body", body);
    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        if (!response.ok) throw new Error("Erreur lors de la suppression de la piste de la playliste");
        return await response.json() as deleteTrackPlaylistResponse;
    } catch (error) {
        console.error("Erreur dans la suppression d'une piste d'une playliste", error);
        return null;
    }
}


export async function deletePlaylist(idPlaylist: string): Promise<deletePlaylistResponse | null> {
    const URL = `${url}/api/playlist/deletePlaylist/${idPlaylist}`;
    try {
        const response = await fetch(URL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
        if (!response.ok) throw new Error("Erreur lors de la suppression de la playliste");
        return await response.json() as deletePlaylistResponse;
    } catch (error) {
        console.error("Erreur dans la suppression d'une playliste", error);
        return null;
    }
}

export async function updatePlaylist(idPlaylist: string, title: string): Promise<updatePlaylistResponse | null> {
    const URL = `${url}/api/playlist/updatePlaylist/${idPlaylist}`;
    const body = { title };
    try {
        const response = await fetch(URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        if (!response.ok) throw new Error("Erreur lors de la mise à jour de la playliste");
        return await response.json() as updatePlaylistResponse;
    } catch (error) {
        console.error("Erreur dans la mise à jour d'une playliste", error);
        return null;
    }
}

export async function getAllPlaylists(userId: string): Promise<playlistAllResponse | null> {
    const URL = `${url}/api/playlist/allPlaylists`;
    const body = { userId };
    console.log("json log ", JSON.stringify(body));
    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),

        });
        if (!response.ok) throw new Error("Erreur lors de la récupération de toutes les playlists");
        return await response.json() as playlistAllResponse;
    } catch (error) {
        console.error("Erreur dans la récupération de toutes les playlists", error);
        return null;
    }
}

export async function getPlaylistById(idPlaylist: string): Promise<playlistIdResponse | null> {
    const URL = `${url}/api/playlist/getPlaylistById/${idPlaylist}`;
    try {
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!response.ok) throw new Error("Erreur lors de la récupération d'une playlist par ID");
        return await response.json() as playlistIdResponse;
    } catch (error) {
        console.error("Erreur dans la récupération d'une playlist par ID", error);
        return null;
    }
}


export function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export async function addTrackFavorite(userId: string, idTrack: string): Promise<addTrackFavoriteResponse | null> {
    const URL = `${url}/api/playlist/addTrackFavorite`;
    const body = { userId, idTrack };
    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error("Erreur lors de l'ajout d'une piste à vos favoris");
        return await response.json() as addTrackFavoriteResponse;
    } catch (error) {
        console.error("Erreur dans l'ajout d'une piste à vos favoris", error);
        return null;
    }
}


export async function deleteTrackfavorite(userId: string, idTrack: string): Promise<deleteTrackFavoriteResponse | null> {
    const URL = `${url}/api/playlist/deleteTrackFavorite`;
    const body = { userId, idTrack };
    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        if (!response.ok) throw new Error("Erreur lors de la suppression d'une piste de vos favoris");
        return await response.json() as deleteTrackFavoriteResponse;
    } catch (error) {
        console.error("Erreur dans la suppression d'une piste de vos favoris", error);
        return null;
    }
}


export async function getFavoritePlaylist(userId: string): Promise<getFavoriteResponse | null> {
    const URL = `${url}/api/playlist/getFavoritePlaylist`;
    const body = { userId };
    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error("Erreur lors de la récupération de vos playlists favorites");
        return await response.json() as getFavoriteResponse;
    } catch (error) {
        console.error("Erreur dans la récupération de vos playlists favorites", error);
        return null;
    }
}