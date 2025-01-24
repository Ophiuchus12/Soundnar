import { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import React from 'react'
import { getMe, verify } from '~/lib/User';
import { getSession } from '~/session.server';

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request.headers.get("Cookie"));
    const token = session.get("authToken");
    let userId: string = "";
    let userName: string = "";

    if (!token) {
        return { isAuthenticated: false, error: null, token: null };
    } else {
        const response = await getMe(token);
        if (response && response.user) {
            userId = response.user.id.toString();
            userName = response.user.username;
        }
    }

    const isValid = await verify(token);
    if (!isValid) {
        return { isAuthenticated: false, error: null, token: null };
    }

    return { isAuthenticated: true, error: null, token: token, userId: userId, userName: userName };
}

export default function Playlists() {
    const { isAuthenticated, token, userId, error, userName } = useLoaderData<{
        isAuthenticated: boolean;
        token: string | null;
        userId: string | null;
        userName: string | null;
        error: string | null;
    }>();

    return (
        <div className="min-h-screen text-white flex items-center justify-center">
            {isAuthenticated ? (
                <div>
                    <h1 className="text-3xl font-bold">Welcome, {userName}</h1>
                    <p className="text-lg mt-2">Your Playlists</p>
                </div>
            ) : (
                <div className="max-w-md text-center bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h1 className="text-4xl font-bold mb-4">Accès limité</h1>
                    <p className="text-lg mb-6">
                        Connectez-vous pour accéder à vos playlists, gérer vos favoris et
                        profiter d'une expérience musicale personnalisée.
                    </p>
                    <div className="flex justify-center">
                        <a
                            href="/auth"
                            className="bg-[#7600be] hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all duration-200"
                        >
                            Se connecter
                        </a>
                        <a
                            href="/auth"
                            className="ml-4 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-all duration-200"
                        >
                            Créer un compte
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}

