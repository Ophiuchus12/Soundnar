import { UserResponse } from "~/types"

//const url = "http://localhost:3000"
//const url = "http://46.202.134.250:3000"
const url = "https://www.api.soundnarmusic.fr"


export async function login(username: string, password: string): Promise<UserResponse | null> {
    const URL = `${url}/api/user/login`;

    const body = { username, password };

    //console.log("login", body);

    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) throw new Error("Erreur lors de la connexion");
        return await response.json() as UserResponse;
    } catch (error) {
        console.error("Erreur dans le login", error);
        return null;
    }
}


export async function register(username: string, password: string): Promise<UserResponse | null> {
    const URL = `${url}/api/user/register`;

    const body = { username, password };

    console.log("register", body);

    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) throw new Error("Erreur lors de l'inscription");
        return await response.json() as UserResponse;
    } catch (error) {
        console.error("Erreur dans l'inscription", error);
        return null;
    }
}


export async function getMe(token: string): Promise<UserResponse | null> {
    const URL = `${url}/api/user/me`;

    try {
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok)
            throw new Error("Erreur lors de la récupération des données");

        return (await response.json()) as UserResponse;
    } catch (error) {
        console.error("Erreur dans getMe:", error);
        return null;
    }
}

export async function verify(token: string): Promise<UserResponse | null> {
    const URL = `${url}/api/user/verify`;

    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error("Erreur lors de la vérification");

        return (await response.json()) as UserResponse;
    } catch (error) {
        return null;
    }
}

export async function updateProfile(token: string, userId: string, username: string, newPassword: string): Promise<UserResponse> {
    const URL = `${url}/api/user/update/${userId}`;

    const body = { username, newPassword };

    try {
        const response = await fetch(URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) throw new Error("Erreur lors de la mise à jour du profil");

        return (await response.json()) as UserResponse;
    } catch (error) {
        console.error("Erreur dans updateProfile:", error);
        throw error;
    }
}