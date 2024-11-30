import { LoaderFunction } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react';
import React, { useEffect, useState } from 'react'
import { getAlbum } from '~/lib/Music';
import { AlbumDetail, Track } from '../types';
import { FaArrowLeft, FaRegPlayCircle } from 'react-icons/fa';
import { GiMusicSpell } from "react-icons/gi";
import "../styles/index.css";


export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const albumId = url.searchParams.get('album');
    return { albumId: albumId }
}
export default function AlbumDetails() {

    const { albumId } = useLoaderData<{ albumId: string }>();
    const albumIdNumber = Number(albumId);  // Conversion en nombre
    const [albumDetails, setAlbumDetails] = useState<AlbumDetail | null>(null);
    const [tracks, setTracks] = useState<Track[] | null>(null);
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

    useEffect(() => {
        const fetchAlbum = async () => {
            if (albumId) {
                const albumData = await getAlbum(Number(albumId));  // Utilisation de `Number(albumId)`
                if (albumData) {
                    setAlbumDetails(albumData);
                    const tracks = albumData.tracks?.data;
                    setTracks(tracks);
                    console.log(tracks);
                } else {
                    console.error('Failed to fetch album');
                }
            }
        };

        fetchAlbum();
    }, [albumId]);

    return (


        <div className='w-full h-full min-h-screen flex flex-col mt-10 bg-black fade-in'>
            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 slide-top">
                    <div className="w-full max-w-lg bg-opacity-80 p-6 bg-gray-500 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out">
                        {/* Image de l'album */}
                        <img
                            className="h-full w-full object-cover rounded-lg mb-4"
                            src={albumDetails?.cover_xl}
                            alt={albumDetails?.title}
                        />

                        {/* Titre de l'album */}
                        <h2 className="mt-4 text-3xl text-white font-semibold">Album title : {albumDetails?.title}</h2>

                        {/* Nom de l'artiste */}
                        <h3 className="mt-2 text-lg text-gray-400">Artist : {albumDetails?.artist.name}</h3>

                        {/* Description (si applicable) */}
                        {albumDetails?.duration && (
                            <h3 className="mt-2 text-lg text-gray-400">
                                Duration: {formatDuration(albumDetails.duration)}
                            </h3>
                        )}


                        <h3 className="mt-2 text-lg text-gray-400">Number of tracks : {albumDetails?.nb_tracks}</h3>

                        <h3 className="mt-2 text-lg text-gray-400">Label : {albumDetails?.label}</h3>


                        {/* Bouton de fermeture */}
                        <button
                            className="mt-6 w-full bg-[#7600be] hover:bg-[#6a00ab] text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                            onClick={() => setModal(false)}
                        >
                            Fermer
                        </button>
                    </div>
                </div>

            )}
            <div className=" flex ml-8">
                <button
                    onClick={() => navigate("/")}
                    className=" text-white text-3xl p-2 rounded-full bg-[#6a00ab] hover:bg-[#3b1d79] transition-all z-40"
                    aria-label="Go back to home"
                >
                    <FaArrowLeft />
                </button>

            </div>
            {/* Affichage de l'album et de l'artiste */}
            <div className="flex items-center justify-center mb-10">
                <div className='' onClick={() => setModal(true)}>
                    <img className="h-80 w-100 rounded-lg shadow-lg" src={albumDetails?.cover_big} alt="Album Cover" />
                    <h1 className="text-white text-3xl mt-4">{albumDetails?.title}</h1>
                    <h2 className="text-gray-400 text-xl">{albumDetails?.artist.name}</h2>
                </div>
            </div>

            {/* Liste des morceaux */}
            <div className="flex flex-col mx-8 md:mx-20 bg-gray-800 p-6 rounded-xl shadow-xl">
                {tracks && tracks.length > 0 ? (
                    tracks.map((track) => (
                        <div key={track.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg mb-4 hover:bg-gray-600">
                            <div className="flex flex-col">
                                <h1 className="text-white text-lg">{track?.title}</h1>
                                <h2 className="text-gray-400 text-sm">{formatDuration(track.duration)}</h2>
                            </div>

                            <button
                                onClick={() => handlePlayClick(track.id)}
                                className="text-white text-3xl p-2 rounded-full bg-[#6a00ab] hover:bg-[#3b1d79] transition-all z-40"
                                aria-label="Lire le morceau"
                            >
                                <GiMusicSpell />
                            </button>

                            {/* Rendre conditionnellement le lecteur audio pour le morceau sélectionné */}
                            {playingTrackId === track.id && (
                                <audio
                                    className="hidden"
                                    controls
                                    autoPlay
                                >
                                    <source src={track.preview} type="audio/mpeg" />
                                    Votre navigateur ne supporte pas l'élément audio.
                                </audio>
                            )}
                        </div>
                    ))
                ) : (
                    <h1 className="text-white text-center text-lg">Aucun morceau disponible</h1>
                )}
            </div>


        </div>
    )
}
