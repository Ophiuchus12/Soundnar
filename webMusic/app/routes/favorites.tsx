import { LoaderFunction, redirect } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import React, { useEffect, useState } from 'react'
import { FaTrash } from 'react-icons/fa';
import { GiMusicSpell } from 'react-icons/gi';
import { getTrackById } from '~/lib/Music';
import { deleteTrackfavorite, getFavoritePlaylist } from '~/lib/Playlist';
import { getMe, verify } from '~/lib/User';
import { getSession } from '~/session.server';
import { getOneTrackData, TrackPerso } from '~/types';

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
    const favorites = await getFavoritePlaylist(userId);
    //console.log("playlists", playlists);


    return { isAuthenticated: true, error: null, token: token, userId: userId, userName: userName, favorites: favorites?.favorites };
}

export default function Favorites() {
    const { isAuthenticated, token, userId, error, userName, favorites } = useLoaderData<{
        isAuthenticated: boolean;
        token: string | null;
        userId: string;
        userName: string | null;
        favorites: TrackPerso[];
        error: string | null;
    }>();

    const [fav, setFav] = useState<getOneTrackData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [playingTrackId, setPlayingTrackId] = useState<string | null>(null); // Stocke l'ID du track en cours de lecture
    const navigate = useNavigate();

    const handlePlayClick = (trackId: string) => {
        // Si le morceau cliqué est déjà en lecture, on l'arrête
        setPlayingTrackId(playingTrackId === trackId ? null : trackId);
    };

    // Fonction pour récupérer les tracks
    const fetchTracks = async () => {
        if (favorites && favorites.length > 0) {
            try {
                const trackData: getOneTrackData[] = [];
                for (const track of favorites) {
                    const res = await getTrackById(track.idTrackDeezer);
                    //console.log("res", res);
                    if (res) {
                        trackData.push(res);
                    }
                }
                setFav(trackData);
            } catch (error) {
                console.error("Erreur lors de la récupération des tracks :", error);
            } finally {
                setLoading(false); // On arrête le chargement une fois les données récupérées
            }
        }
    };

    useEffect(() => {
        fetchTracks();
    }, [favorites]);

    const handleDeleteTrack = async (idTrack: string) => {

        try {
            const IdTrackString = idTrack.toString();
            const handleDelete = await deleteTrackfavorite(userId, IdTrackString);
            if (handleDelete) {
                redirect(`/favorites`);
            }
        } catch (err) {
            console.error("Erreur lors de la suppression de la playlist :", err);
        }

    };

    if (!isAuthenticated) {
        return (
            <div className="flex w-full h-full items-center justify-center ">
                <div className="max-w-md text-center bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg">
                    <h1 className="text-4xl text-white font-bold mb-4">Limited Access</h1>
                    <p className="text-lg text-gray-300 mb-6">
                        Log in to manage your favorites and enjoy a personalized music experience.
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
            </div>
        );
    }

    return (
        <div className="text-white flex flex-col items-center px-6 py-10">
            <div className="w-full max-w-5xl">
                <h1 className="text-4xl font-bold text-white mb-8 text-center">
                    🎵 Your Favorite Tracks, {userName}
                </h1>

                {fav.length === 0 ? (
                    <p className="text-lg text-gray-400 text-center">You haven't added any favorite tracks yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {fav.map((track) => (
                            <div
                                key={track.id}
                                className="relative bg-gray-900 p-5 rounded-xl shadow-lg flex flex-col items-center text-center transition-all hover:bg-[#4a2496] hover:scale-105 group"  // Ajout de 'group' ici
                            >
                                {/* Cover Image */}
                                <img
                                    src={`https://e-cdns-images.dzcdn.net/images/cover/${track.md5_image}/250x250-000000-80-0-0.jpg`}
                                    alt={track.title}
                                    className="w-20 h-20 object-cover rounded-lg shadow-md"
                                />

                                {/* Track Info */}
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold text-white truncate w-40">{track.title}</h3>
                                    <p className="text-sm text-gray-300 truncate">{track.artist.name}</p>
                                </div>

                                <div className="flex items-center space-x-2">
                                    {/* Bouton de suppression visible au survol */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Empêche le clic de déclencher l'action parent
                                            handleDeleteTrack(track.id);
                                        }}
                                        className="bg-red-500 text-white p-2 rounded-full "
                                        aria-label="Delete Track"
                                    >
                                        <FaTrash size={20} />
                                    </button>

                                    {/* Bouton de lecture/arrêt */}
                                    <button
                                        onClick={() => handlePlayClick(track.id)}
                                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all shadow-md ${playingTrackId === track.id
                                            ? "bg-purple-600 text-white"
                                            : "bg-gray-700 text-gray-400 hover:bg-purple-800 hover:text-white"
                                            }`}
                                        aria-label={playingTrackId === track.id ? "Stop" : "Play"}
                                    >
                                        <GiMusicSpell size={20} className='text-white' />
                                    </button>
                                </div>

                                {/* Audio Player */}
                                {playingTrackId === track.id && (
                                    <audio className="hidden" controls autoPlay>
                                        <source src={track.preview} type="audio/mpeg" />
                                        Your browser does not support the audio element.
                                    </audio>
                                )}
                            </div>
                        ))}
                    </div>

                )}
            </div>
        </div>
    );
}