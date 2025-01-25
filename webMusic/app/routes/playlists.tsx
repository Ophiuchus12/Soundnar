import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import React, { useEffect, useState } from 'react'
import { createPlaylist, getAllPlaylists } from '~/lib/Playlist';
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
    //console.log("user", userId);
    const playlists = await getAllPlaylists(userId);


    return { isAuthenticated: true, error: null, token: token, userId: userId, userName: userName, playlists: playlists };
}

export const action: ActionFunction = async ({ request }) => {
    let userId: string = "";
    const session = await getSession(request.headers.get("Cookie"));
    const token = session.get("authToken");
    const response = await getMe(token);
    const errors: Record<string, string> = {}

    if (response && response.user) {
        userId = response.user.id.toString();
    }

    const fromData = await request.formData();
    const playlistTitle = fromData.get("title") as string;

    try {
        if (!playlistTitle) {
            errors.title = "Title is required";
        }

        if (Object.keys(errors).length > 0) {
            return { errors };
        }

        const playlistCreation = await createPlaylist(playlistTitle, userId)

        if (!playlistCreation) {
            errors.title = "An error occurred while creating the playlist";
            return { errors };
        } else {
            return redirect("/playlists");
        }
    } catch (error) {
        console.error(error);

        let errorMessage = "An unexpected error occurred.";

        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return { error: errorMessage };
    }
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

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [playlistTitle, setplaylistTitle] = useState("");
    const [errors, setErrors] = useState<{
        title?: string;
    }>({});
    const actionData = useActionData<typeof action>();

    useEffect(() => {
        if (actionData?.errors) {
            setErrors(actionData.errors);
        } else {
            setErrors({});
        }
    }, [actionData]);

    const toggleForm = () => setIsFormVisible(!isFormVisible);


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
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={toggleForm}
                            className="bg-[#7600be] hover:bg-[#8c00c8] text-white py-2 px-4 rounded-lg transition-all duration-200"
                        >
                            Add a Playlist
                        </button>
                    </div>
                </div>
            ) : (
                <div className="max-w-md text-center bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h1 className="text-4xl font-bold mb-4">Accès limité</h1>
                    <p className="text-lg mb-6">
                        Log in to access your playlists, manage your favorites,
                        and enjoy a personalized music experience.
                    </p>
                    <div className="flex justify-center">
                        <a
                            href="/auth"
                            className="bg-[#7600be] hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all duration-200"
                        >
                            Login
                        </a>
                        <a
                            href="/auth"
                            className="ml-4 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-all duration-200"
                        >
                            Signin
                        </a>
                    </div>
                </div>
            )}

            {/* Modal */}
            {isFormVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out opacity-100">
                    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md transform transition-transform duration-300 ease-in-out scale-95 hover:scale-100">
                        <h2 className="text-2xl font-semibold text-white mb-6">Your new Playlist</h2>
                        <Form method="post">
                            <div className="mb-6">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                                    title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={playlistTitle}
                                    onChange={(e) => setplaylistTitle(e.target.value)}
                                    className="mt-2 p-3 w-full bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#7600be] focus:outline-none"
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-xs">{errors.title}</p>
                                )}
                            </div>

                            <div className="flex justify-between items-center mt-6">

                                <button
                                    type="submit"
                                    className="bg-[#7600be] hover:bg-[#8c00c8] text-white py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
                                >
                                    Create your playlist
                                </button>

                                <div className="w-4" />

                                <button
                                    type="button"
                                    onClick={toggleForm}
                                    className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
                                >
                                    Cancel
                                </button>
                            </div>
                        </Form>
                    </div>
                </div>
            )}

        </div>
    );
}
