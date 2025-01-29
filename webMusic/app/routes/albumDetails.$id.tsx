import { LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react';
import React, { useEffect, useState } from 'react'
import { getAlbum } from '~/lib/Music';
import { AlbumDetail, PlaylistPerso } from '../types';
import { FaArrowLeft } from 'react-icons/fa';
import { GiMusicSpell } from "react-icons/gi";
import { PiMusicNotesPlus } from "react-icons/pi";
import "../styles/index.css";
import AddMenu from '~/components/addMenu';
import { getSession } from '~/session.server';
import { getMe, verify } from '~/lib/User';
import { getAllPlaylists } from '~/lib/Playlist';

export async function loader({ params, request }: LoaderFunctionArgs) {
    const { id } = params;
    const session = await getSession(request.headers.get("Cookie"));
    const token = session.get("authToken");
    let userId: string = "";

    if (!id) {
        throw new Error('Missing artist ID');
    }

    const albumData = await getAlbum(Number(id));
    if (!albumData) {
        console.error('Failed to fetch artist');
    }

    if (!token) {
        return { isAuthenticated: false, albumData: albumData };
    } else {
        const response = await getMe(token);
        if (response && response.user) {
            userId = response.user.id.toString();
        }
    }

    const isValid = await verify(token);
    if (!isValid) {
        return { isAuthenticated: false, error: null, token: null };
    }
    //console.log("user", userId);
    const playlists = await getAllPlaylists(userId);


    return { isAuthenticated: true, error: null, token: token, albumData: albumData, playlists: playlists }

}


export default function AlbumDetails() {

    const { isAuthenticated, error, token, albumData, playlists } = useLoaderData<{
        albumData: AlbumDetail;
        isAuthenticated: boolean;
        token: string | null;
        playlists: PlaylistPerso[];
        error: string | null;
    }>();


    const [modal, setModal] = useState(false);
    const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);
    const navigate = useNavigate();

    function formatDuration(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }


    const handlePlayClick = (trackId: number) => {
        // Si le morceau cliqué est déjà en lecture, on l'arrête
        setPlayingTrackId(playingTrackId === trackId ? null : trackId);
    };

    const handleArtist = (artistId: number) => {
        navigate(`/artistDetails/${artistId}`)
    }

    const [addMenuTrackId, setAddMenuTrackId] = useState<number | null>(null);

    const toggleAddMenu = (trackId: number) => {
        //console.log("trackId", trackId);
        setAddMenuTrackId(addMenuTrackId === trackId ? null : trackId);
    };


    return (


        <div className='w-full h-full min-h-screen flex flex-col mt-10 bg-black fade-in'>
            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 slide-top">
                    <div className="w-full max-w-xl transform rounded-2xl bg-gray-900 p-6 shadow-2xl transition-all">
                        <div className="relative aspect-square overflow-hidden rounded-xl">
                            <img
                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                src={albumData?.cover_xl}
                                alt={albumData?.title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        </div>

                        <div className="mt-6 space-y-4">
                            <h2 className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                                {albumData?.title}
                            </h2>
                            <div className="space-y-2 text-gray-300">
                                <p className="text-lg">Artist: {albumData?.artist.name}</p>
                                <p>Duration: {formatDuration(albumData?.duration || 0)}</p>
                                <p>Tracks: {albumData?.nb_tracks}</p>
                                <p>Label: {albumData?.label}</p>
                            </div>

                            {albumData?.contributors && albumData.contributors.length > 1 && (
                                <div className="space-y-1">
                                    <h3 className="text-lg font-semibold text-white">Contributors</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {albumData.contributors.map((contributor) => (
                                            <button onClick={() => handleArtist(contributor.id)}>
                                                <span
                                                    key={contributor.id}
                                                    className="rounded-full bg-purple-900/50 px-3 py-1 text-sm text-white"
                                                >
                                                    {contributor.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                className="mt-6 w-full rounded-full bg-purple-600 px-6 py-3 font-semibold text-white transition-all hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                                onClick={() => setModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className=" flex ml-8">
                <button
                    onClick={() => navigate(-1)}
                    className=" text-white text-3xl p-2 rounded-full bg-[#6a00ab] hover:bg-[#3b1d79] transition-all z-40"
                    aria-label="Go back to home"
                >
                    <FaArrowLeft />
                </button>

            </div>

            {/* Affichage de l'album et de l'artiste */}
            <div className="relative px-6 pt-10">
                <div className="mx-auto max-w-6xl">
                    <div className="flex flex-col items-center space-y-6 mb-6">
                        <button
                            onClick={() => setModal(true)}
                            className="group relative rounded-xl transition-transform hover:scale-105 focus:outline-none"
                        >
                            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-900 opacity-75 blur-lg transition-all group-hover:opacity-100" />
                            <div className="relative aspect-square w-80 overflow-hidden rounded-xl border-2 border-purple-500/50">
                                <img
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    src={albumData?.cover_big}
                                    alt="Album Cover"
                                />
                            </div>
                        </button>
                        <div className="text-center">
                            <h1 className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 bg-clip-text text-4xl font-bold text-transparent">
                                {albumData?.title}
                            </h1>
                            <button onClick={() => handleArtist(albumData?.artist.id)}>
                                <h2 className="mt-2 text-xl text-gray-400" >
                                    {albumData?.artist.name}
                                </h2>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Liste des morceaux */}
            <div className="flex flex-col mx-8 md:mx-20 bg-gray-800 p-6 rounded-xl shadow-xl ">
                <p className='text-3xl text-white mb-3'>Tracks : {albumData?.nb_tracks}</p>
                <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                    {albumData?.tracks.data.map((track) => (
                        <div key={track.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg mb-4 hover:bg-gray-600">
                            {/* Titre et durée */}
                            <div className="flex flex-col">
                                <h1 className="text-white text-lg">{track?.title}</h1>
                                <h2 className="text-gray-400 text-sm">{formatDuration(track.duration)}</h2>
                            </div>

                            {/* Icônes alignées à droite */}
                            <div className="flex items-center justify-end gap-4">
                                {/* Bouton Lecture */}
                                <button
                                    onClick={() => handlePlayClick(track.id)}
                                    className={`rounded-full p-2 transition-all ${playingTrackId === track.id
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-800 text-gray-400 hover:bg-purple-900/50 hover:text-white'
                                        }`}
                                    aria-label={playingTrackId === track.id ? 'Stop' : 'Play'}
                                >
                                    <GiMusicSpell className="w-6 h-6 text-white" />
                                </button>

                                {/* Bouton Ajout Playlist */}
                                {isAuthenticated && (
                                    <button
                                        onClick={() => toggleAddMenu(track.id)}
                                        className="p-2 rounded-full bg-gray-800 hover:bg-purple-600 text-gray-400 hover:text-white transition-all shadow-md active:scale-90"
                                        aria-label="Add to playlist"
                                    >
                                        <PiMusicNotesPlus className="h-5 w-5 text-white" />
                                    </button>
                                )}

                            </div>

                            {/* Affichage conditionnel du menu d'ajout */}
                            {addMenuTrackId === track.id && (
                                <AddMenu idTrackDeezer={track.id} playlists={playlists} onClose={() => setAddMenuTrackId(null)} />
                            )}

                            {/* Affichage conditionnel du lecteur audio */}
                            {playingTrackId === track.id && (
                                <audio className="hidden" controls autoPlay>
                                    <source src={track.preview} type="audio/mpeg" />
                                    Votre navigateur ne supporte pas l'élément audio.
                                </audio>
                            )}
                        </div>
                    ))
                    }
                </div>
            </div>


        </div>
    )
}
