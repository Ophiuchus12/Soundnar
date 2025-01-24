import { addTrackResponse, deleteTrackPlaylistResponse, responsePlaylistCreation, deletePlaylistResponse } from "~/types";

const url = "http://localhost:3000"

export async function createPlaylist(title: string, authorId: string): Promise<responsePlaylistCreation | null> {
    const URL = `{url}/api/playlist/create`;
    const body = { title, authorId };
    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        if (!response.ok) throw new Error("Erreur lors de la création de la playliste");
        return await response.json() as responsePlaylistCreation;
    } catch (error) {
        console.error("Erreur dans la création d'une playlist", error);
        return null;
    }
}

export async function addTrack(idPlaylist: string, idTrack: number): Promise<addTrackResponse | null> {
    const URL = `{url}/api/playlist/addTrack`;
    const body = { idPlaylist, idTrack };
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
    const URL = `{url}/api/playlist/deleteTrack`;
    const body = { idPlaylist, idTrack };
    try {
        const response = await fetch(URL, {
            method: "DELETE",
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
    const URL = `{url}/api/playlist/deletePlaylist/${idPlaylist}`;
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