import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/node';
import { Form, useActionData, useLoaderData, useNavigate } from '@remix-run/react';
import React, { useEffect, useState } from 'react'
import { createPlaylist, formatTime, getAllPlaylists } from '~/lib/Playlist';
import { getMe, verify } from '~/lib/User';
import { getSession } from '~/session.server';
import { PlaylistPerso } from '~/types';




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

        if ("error" in playlistCreation) {
            console.error("Erreur lors de la création de la playlist :", playlistCreation.error);
            return { errors: { title: playlistCreation.error } }; // Retournez l'erreur
        } else {
            const playlistId = playlistCreation.playlist.idPlaylist;
            return redirect(`/playlistDetails/${playlistId}`);
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
    const navigate = useNavigate();

    useEffect(() => {
        if (actionData?.errors) {
            setErrors(actionData.errors);
        }
    }, [actionData]);

    const toggleForm = () => setIsFormVisible(!isFormVisible);

    const handleClickPlaylist = (id: string) => {
        navigate((`/playlistDetails/${id}`))
    }


    return (
        <div className="min-h-screen text-white flex items-center justify-center">
            {isAuthenticated ? (
                <div>
                    <h1 className="text-3xl font-bold">Welcome, {userName}</h1>
                    <p className="text-lg mt-2">Your Playlists</p>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
                        {playlists.length > 0 ? (
                            playlists.map((playlist) => (
                                <div
                                    key={playlist.idPlaylist}
                                    className="group relative bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer transform 
                                    transition-transform duration-300 ease-in-out scale-100 hover:scale-110"
                                    onClick={() => handleClickPlaylist(playlist.idPlaylist)}
                                >
                                    <h2 className="text-2xl font-semibold text-white group-hover:text-[#7600be] transition-colors duration-300">
                                        {playlist.title}
                                    </h2>
                                    <p className="mt-2 text-sm text-gray-400">
                                        <span className="font-bold text-white">Tracks:</span> {playlist.nbTracks}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-400">
                                        <span className="font-bold text-white">Duration:</span> {formatTime(playlist.duration)}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center col-span-full">
                                You don't have any playlists yet.
                            </p>
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
                    <h1 className="text-4xl font-bold mb-4">Limited access</h1>
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
