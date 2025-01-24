import { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import React from 'react'
import { getAllPlaylists } from '~/lib/Playlist';
import { getMe, verify } from '~/lib/User';
import { getSession } from '~/session.server';
import { playlistAllResponse, PlaylistPerso } from '~/types';

function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}


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
    console.log("user", userId);
    const playlists = await getAllPlaylists(userId);


    return { isAuthenticated: true, error: null, token: token, userId: userId, userName: userName, playlists: playlists };
}

export default function Playlists() {
    const { isAuthenticated, token, userId, error, userName, playlists } = useLoaderData<{
        isAuthenticated: boolean;
        token: string | null;
        userId: string | null;
        userName: string | null;
        playlists: PlaylistPerso[];
        error: string | null;
    }>();



    return (
        <div className="min-h-screen text-white flex items-center justify-center">
            {isAuthenticated ? (
                <div>
                    <h1 className="text-3xl font-bold">Welcome, {userName}</h1>
                    <p className="text-lg mt-2">Your Playlists</p>
                    <div className="mt-4">
                        {playlists.length > 0 ? (
                            playlists.map((playlist) => (
                                <div
                                    key={playlist.idPlaylist}
                                    className="my-2 bg-gray-800 p-4 rounded-lg shadow"
                                >
                                    <h2 className="text-xl font-semibold">{playlist.title}</h2>
                                    <p className="text-sm text-gray-400">
                                        {playlist.nbTracks} tracks
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {formatTime(playlist.tempsPlaylist)} minutes
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400">You don't have any playlists yet.</p>
                        )}
                    </div>
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
