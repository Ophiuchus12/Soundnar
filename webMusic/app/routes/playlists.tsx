import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/node';
import { Form, useActionData, useLoaderData, useNavigate } from '@remix-run/react';
import React, { useEffect, useState } from 'react'
import { createPlaylist, deletePlaylist, formatTime, getAllPlaylists } from '~/lib/Playlist';
import { FaTrash } from "react-icons/fa";
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
    //console.log("playlists", playlists);


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
    const [playlistTitle, setPlaylistTitle] = useState("");
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
        navigate(`/playlistDetails/${id}`);
    };

    const handleDeletePlaylist = async (id: string) => {
        if (id !== undefined) {
            try {
                const handleDelete = await deletePlaylist(id);
                if (handleDelete) {
                    navigate('/playlists')
                }
            } catch (err) {
                console.error("Erreur lors de la suppression de la playlist :", err);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center px-6 py-10">
            {isAuthenticated ? (
                <div className="w-full max-w-5xl">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold">Welcome, {userName}</h1>
                            <p className="text-lg text-gray-400">Your Playlists</p>
                        </div>
                        <button
                            onClick={toggleForm}
                            className="bg-[#7600be] hover:bg-[#8c00c8] text-white py-2 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                            Add a Playlist
                        </button>
                    </div>

                    {/* Playlists Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {playlists.length > 0 ? (
                            playlists.map((playlist) => (
                                <div
                                    key={playlist.idPlaylist}
                                    className="group relative bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform scale-100 hover:scale-105"
                                    onClick={() => handleClickPlaylist(playlist.idPlaylist)}
                                >
                                    {/* Playlist Title */}
                                    <h2 className="text-2xl font-semibold truncate text-white group-hover:text-[#7600be] transition-colors duration-300">
                                        {playlist.title}
                                    </h2>

                                    {/* Playlist Info */}
                                    <div className="mt-2 text-gray-300">
                                        <p><span className="font-bold text-white">Tracks:</span> {playlist.nbTracks}</p>
                                        <p><span className="font-bold text-white">Duration:</span> {formatTime(playlist.duration)}</p>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeletePlaylist(playlist.idPlaylist);
                                        }}
                                        className="absolute bottom-3 right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 hover:scale-110 transition-all duration-200"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center col-span-full">
                                You don't have any playlists yet.
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="max-w-md text-center bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg">
                    <h1 className="text-4xl font-bold mb-4">Limited Access</h1>
                    <p className="text-lg text-gray-300 mb-6">
                        Log in to manage your playlists and enjoy a personalized music experience.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a
                            href="/auth"
                            className="bg-[#7600be] hover:bg-[#8c00c8] text-white py-2 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                            Login
                        </a>
                        <a
                            href="/auth"
                            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                            Sign Up
                        </a>
                    </div>
                </div>
            )}
            {/* Modal Add Playlist */}
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
                                    onChange={(e) => setPlaylistTitle(e.target.value)}
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
