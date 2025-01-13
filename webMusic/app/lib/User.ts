import { UserResponse } from "~/types"

const url = "http://localhost:3000"

export async function login(username: string, password: string): Promise<UserResponse | null> {
    const URL = `${url}/api/user/login`;

    const body = { username, password };

    console.log("login", body);

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