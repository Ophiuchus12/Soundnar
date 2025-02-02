import { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react';
import React, { useEffect, useState } from 'react'
import { CiHeart } from 'react-icons/ci';
import { FaArrowLeft } from 'react-icons/fa';
import { GiMusicSpell } from 'react-icons/gi';
import { PiMusicNotesPlus } from 'react-icons/pi';
import AddMenu from '~/components/addMenu';
import { getArtist, getArtistAlbums, getArtistTopSong } from '~/lib/Music';
import { addTrackFavorite, deleteTrackfavorite, getAllPlaylists, getFavoritePlaylist } from '~/lib/Playlist';
import { getMe, verify } from '~/lib/User';
import { getSession } from '~/session.server';
import { ArtistDetail, ArtistDetailAlbumList, ArtistTopSongList, PlaylistPerso } from '~/types';

export async function loader({ params, request }: LoaderFunctionArgs) {
    const { id } = params;
    const session = await getSession(request.headers.get("Cookie"));
    const token = session.get("authToken");
    let userId: string = "";

    if (!id) {
        throw new Error('Missing artist ID');
    }

    const artistData = await getArtist(Number(id));
    if (!artistData) {
        console.error('Failed to fetch artist');
        return null;
    }

    const artistDataAlbums = await getArtistAlbums(Number(id))
    if (!artistDataAlbums) {
        console.error('Failed to fetch artist albums');
        return null;
    }

    const topArtistDataSong = await getArtistTopSong(Number(id));
    if (!topArtistDataSong) {
        console.error('Failed to fetch top artist song');
        return null;
    }

    if (!token) {
        return { isAuthenticated: false, artistData: artistData, artistDataAlbums: artistDataAlbums, topArtistDataSong: topArtistDataSong };
    } else {
        const response = await getMe(token);
        if (response && response.user) {
            userId = response.user.id.toString();
        }
    }

    const isValid = await verify(token);
    if (!isValid) {
        return { isAuthenticated: false, error: null, token: null, artistData: artistData, artistDataAlbums: artistDataAlbums, topArtistDataSong: topArtistDataSong };
    }
    //console.log("user", userId);
    const playlists = await getAllPlaylists(userId);
    const favorites = await getFavoritePlaylist(userId);
    const idFavoriteTracks = favorites?.favorites.map(fav => fav.idTrackDeezer) || [];


    return { artistData: artistData, artistDataAlbums: artistDataAlbums, topArtistDataSong: topArtistDataSong, isAuthenticated: true, error: null, token: token, userId: userId, idFavoriteTracks: idFavoriteTracks, playlists: playlists }

}


export default function ArtistDetails() {

    const { artistData, artistDataAlbums, topArtistDataSong, isAuthenticated, token, userId, idFavoriteTracks, error, playlists } = useLoaderData<{
        artistData: ArtistDetail;
        artistDataAlbums: ArtistDetailAlbumList;
        topArtistDataSong: ArtistTopSongList;
        isAuthenticated: boolean;
        token: string | null;
        userId: string | null;
        idFavoriteTracks: string[];
        playlists: PlaylistPerso[];
        error: string | null;
    }>();
    const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

    const [addMenuTrackId, setAddMenuTrackId] = useState<string | null>(null);

    const [idFav, setIdFav] = useState<string | null>("");

    const addFavorite = async () => {
        if (!idFav || !userId) {
            // Si idFav ou userId sont absents, on ne fait rien
            return;
        }

        try {
            const idTrack = idFav.toString();
            await addTrackFavorite(userId, idTrack);
            console.log("Track added to favorites successfully!");
            setIdFav(null);
            idFavoriteTracks.push(idTrack);
        } catch (error) {
            console.error("Error adding track to favorites:", error);
        }
    };

    const removeFavorite = async () => {
        if (!idFav || !userId) {
            // Si idFav ou userId sont absents, on ne fait rien
            return;
        }

        try {
            const idTrack = idFav.toString();
            await deleteTrackfavorite(userId, idTrack);
            console.log("Track removed to favorites successfully!");
            setIdFav(null);
            const index = idFavoriteTracks.indexOf(idTrack);
            if (index > -1) {
                idFavoriteTracks.splice(index, 1); // Remove the track from the array
            }
        } catch (error) {
            console.error("Error adding track to favorites:", error);
        }
    };

    const toggleForm = () => { setIdFav(null); }


    const toggleAddMenu = (trackId: string) => {
        //console.log("trackId", trackId);
        setAddMenuTrackId(addMenuTrackId === trackId ? null : trackId);
    };
    const navigate = useNavigate();

    const handleClickAlbum = (idAlbum: number) => {
        navigate(`/albumDetails/${idAlbum}`)
    };

    function formatDuration(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }


    const handlePlayClick = (trackId: string) => {
        // Si le morceau cliqué est déjà en lecture, on l'arrête
        setPlayingTrackId(playingTrackId === trackId ? null : trackId);
    };

    return (
        <div className='w-full h-full min-h-screen flex flex-col mt-10 bg-black fade-in'>

            <div className=" flex ml-8">
                <button
                    onClick={() => navigate(-1)}
                    className=" text-white text-3xl p-2 rounded-full bg-[#6a00ab] hover:bg-[#3b1d79] transition-all z-40"
                    aria-label="Go back to home"
                >
                    <FaArrowLeft />
                </button>

            </div>
            <div className="relative px-6 pt-10">
                <div className="mx-auto max-w-6xl">
                    <div className="flex flex-col items-center space-y-6">
                        {/* Artist Image */}
                        <div className="group relative">
                            <div className="absolute -inset-1 animate-pulse rounded-full bg-gradient-to-r from-purple-600 to-purple-900 opacity-75 blur-lg transition-all group-hover:opacity-100" />
                            <div className="relative h-64 w-64 overflow-hidden rounded-full border-2 border-purple-500/50">
                                <img
                                    src={artistData?.picture_big}
                                    alt={artistData?.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                        </div>

                        {/* Artist Info */}
                        <div className="text-center">
                            <h1 className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 bg-clip-text text-4xl font-bold text-transparent">
                                {artistData?.name}
                            </h1>
                            <p className="mt-2 text-gray-400">
                                {new Intl.NumberFormat().format(artistData?.nb_fan)} fans
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex w-full px-6 pb-20 space-x-6 mt-10">
                {/* Albums Section */}
                <div className="w-1/2">
                    <h2 className="mb-8 text-2xl font-bold text-white">Top musics</h2>
                    <div
                        className="overflow-y-auto"
                        style={{ maxHeight: '400px' }}
                    >
                        {topArtistDataSong.data.map((track) => (
                            <div key={track.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg mb-4 hover:bg-gray-600">
                                <div className="flex items-center space-x-4">
                                    {/* Bouton Play/Stop */}
                                    {isAuthenticated && (
                                        <button
                                            onClick={() => setIdFav(track.id)}
                                            className={`rounded-full p-2 transition-all 
                                                                                ${idFavoriteTracks.includes((track.id).toString())
                                                    ? "bg-red-600 text-white"  // ❤️ Si favori, icône rouge
                                                    : "bg-gray-800 text-gray-400 hover:bg-purple-900/50 hover:text-white"
                                                }`}
                                            aria-label="Add to Favorites"
                                        >
                                            <CiHeart className="w-6 h-6" />
                                        </button>
                                    )}

                                    {/* Informations sur la piste */}
                                    <div className="flex flex-col">
                                        <h1 className="text-white text-lg">{track?.title}</h1>
                                        <h2 className="text-gray-400 text-sm">{formatDuration(track.duration)}</h2>
                                    </div>
                                </div>

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
                        ))}
                    </div>
                    {idFav && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out opacity-100">
                            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md transform transition-transform duration-300 ease-in-out scale-95 hover:scale-100">
                                <h2 className="text-2xl font-semibold text-white mb-6">Your favorites ?</h2>

                                <div className="flex justify-between items-center mt-6">
                                    {idFavoriteTracks.includes((idFav).toString()) ?
                                        <button
                                            type="button"
                                            className="bg-[#7600be] hover:bg-[#8c00c8] text-white py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
                                            onClick={removeFavorite}
                                        >
                                            Remove from favorite
                                        </button> :
                                        <button
                                            type="button"
                                            className="bg-[#7600be] hover:bg-[#8c00c8] text-white py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
                                            onClick={addFavorite}
                                        >
                                            Add to favorite
                                        </button>
                                    }

                                    <div className="w-4" />

                                    <button
                                        type="button"
                                        onClick={toggleForm}
                                        className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
                                    >
                                        Cancel
                                    </button>
                                </div>

                            </div>
                        </div>
                    )}
                </div>

                <div className="w-1/2">
                    <h2 className="mb-8 text-2xl font-bold text-white">Albums</h2>
                    <div
                        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 overflow-y-auto"
                        style={{ maxHeight: '400px' }}
                    >
                        {artistDataAlbums.data.map((album) => (
                            <button
                                key={album.id}
                                onClick={() => handleClickAlbum(album.id)}
                                className="group relative overflow-hidden rounded-xl bg-gray-800/50 p-3 transition-all duration-300 hover:-translate-y-1 hover:bg-gray-800"
                            >
                                {/* Album Cover */}
                                <div className="aspect-square overflow-hidden rounded-lg">
                                    <img
                                        src={album.cover_medium}
                                        alt={album.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                </div>

                                {/* Album Title */}
                                <h3 className="mt-3 truncate text-sm font-medium text-gray-200 transition-colors group-hover:text-white">
                                    {album.title}
                                </h3>
                                <p className="text-white">
                                    {new Date(album.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}
