import { responsePlaylistCreation } from "~/types";

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