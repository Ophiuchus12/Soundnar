import { createCookieSessionStorage } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "auth-session",
        secure: process.env.NODE_ENV === "production",
        secrets: ["votre-secret"], // Remplacez par votre propre secret
        sameSite: "lax",
        path: "/",
        httpOnly: true,
    },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

