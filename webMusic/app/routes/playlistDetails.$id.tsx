import { LoaderFunction } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react';
import React, { useEffect, useState } from 'react'
import { CiHeart } from 'react-icons/ci';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';
import { GiMusicSpell } from 'react-icons/gi';
import { getTrackById } from '~/lib/Music';
import { addTrackFavorite, deleteTrackfavorite, deleteTrackPlaylist, formatTime, getFavoritePlaylist, getPlaylistById } from '~/lib/Playlist';
import { getMe, verify } from '~/lib/User';
import { getSession } from '~/session.server'
import { getOneTrackData, PlaylistPerso, TrackPerso } from '~/types';



export const loader: LoaderFunction = async ({ request, params }) => {
  try {
    const session = await getSession(request.headers.get("Cookie"));
    const token = session.get("authToken");
    let userId: string = "";
    let userName: string = "";

    if (!token) {
      return {
        isAuthenticated: false, error: "Missing token", token: null, playlist: null,
      };
    }

    const isValid = await verify(token);
    if (!isValid) {
      return {
        isAuthenticated: false, error: "Invalid token", token: null, playlist: null,
      };
    } else {
      const response = await getMe(token);
      if (response && response.user) {
        userId = response.user.id.toString();
      }
    }

    const playlistId = params.id;
    if (!playlistId) {
      return {
        isAuthenticated: true, error: "Playlist ID not provided", token, userId, playlist: null,
      };
    }

    const playlist = await getPlaylistById(playlistId);
    if (!playlist) {
      return {
        isAuthenticated: true, error: "Playlist not found", token, userId, playlist: null,
      };
    }
    const favorites = await getFavoritePlaylist(userId);
    const idFavoriteTracks = favorites?.favorites.map(fav => fav.idTrackDeezer) || [];

    return {
      isAuthenticated: true, error: null, token, userId, idFavoriteTracks: idFavoriteTracks, playlist,
    };
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return {
      isAuthenticated: false,
      error: "An unexpected error occurred",
      token: null,
      userId: null,
      playlist: null,
    };
  }
};
export default function PlaylistDetails() {

  const { isAuthenticated, token, userId, idFavoriteTracks, playlist, error } = useLoaderData<{
    isAuthenticated: boolean;
    token: string | null;
    userId: string | null;
    idFavoriteTracks: string[];
    playlist: PlaylistPerso | null;
    error: string | null;
  }>();


  const [tracks, setTracks] = useState<getOneTrackData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null); // Stocke l'ID du track en cours de lecture
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
      navigate(`/playlistDetails/${playlist?.idPlaylist}`);
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
      navigate(`/playlistDetails/${playlist?.idPlaylist}`);
    } catch (error) {
      console.error("Error adding track to favorites:", error);
    }
  };

  const toggleForm = () => { setIdFav(null); }


  const handlePlayClick = (trackId: string) => {
    // Si le morceau cliqué est déjà en lecture, on l'arrête
    setPlayingTrackId(playingTrackId === trackId ? null : trackId);
  };

  // Fonction pour récupérer les tracks
  const fetchTracks = async () => {
    if (playlist && playlist.songs.length > 0) {
      try {
        const trackData: getOneTrackData[] = [];
        for (const track of playlist.songs) {
          const res = await getTrackById(track.idTrackDeezer);
          //console.log("res", res);
          if (res) {
            trackData.push(res);
          }
        }
        setTracks(trackData);
      } catch (error) {
        console.error("Erreur lors de la récupération des tracks :", error);
      } finally {
        setLoading(false); // On arrête le chargement une fois les données récupérées
      }
    }
  };

  useEffect(() => {
    fetchTracks();
  }, [playlist]);

  const handleDeleteTrack = async (idTrack: string, idPlaylist: string | undefined) => {
    if (idTrack !== undefined && idPlaylist !== undefined) {
      try {
        const IdTrackString = idTrack.toString();
        const handleDelete = await deleteTrackPlaylist(idPlaylist, IdTrackString);
        if (handleDelete) {

          navigate(`/playlistDetails/${idPlaylist}`);
        }
      } catch (err) {
        console.error("Erreur lors de la suppression de la playlist :", err);
      }
    }
  };

  const navigate = useNavigate();
  return (
    <div className="w-full h-full min-h-screen flex flex-col bg-black fade-in">
      {isAuthenticated ? (
        <div className="flex flex-col mt-10">
          <div className="flex items-center ml-8 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-white text-3xl p-2 rounded-full bg-[#6a00ab] hover:bg-[#3b1d79] transition-all z-40"
              aria-label="Go back"
            >
              <FaArrowLeft />
            </button>
          </div>

          {/* Contenu principal de la playlist */}
          <div className="mx-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white">{playlist?.title}</h2>
              <p className="text-lg text-gray-400">{playlist?.songs.length} Tracks</p>
              <p className="text-lg text-gray-400">{formatTime(playlist?.duration || 0)} minutes</p>
            </div>

            <div className="space-y-6">
              {tracks.length > 0 ? (
                tracks.map((track) => (
                  <div
                    key={track.id}
                    className="relative bg-gray-800 p-4 rounded-lg shadow-lg flex items-center justify-between hover:bg-[#3b1d79] transition-all group"
                  >
                    {/* Image de couverture */}
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

                    {/* Thumbnail */}
                    <img
                      src={`https://e-cdns-images.dzcdn.net/images/cover/${track.md5_image}/250x250-000000-80-0-0.jpg`}
                      alt={track.title}
                      className="w-16 h-16 object-cover rounded-lg ml-3"
                    />

                    {/* Infos du morceau */}
                    <div className="flex-1 ml-4">
                      <h3 className="text-lg font-semibold text-white truncate">{track.title}</h3>
                      <p className="text-sm text-gray-400 truncate">by {track.artist.name}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Bouton de suppression */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Empêche le clic de déclencher l'action parent
                          handleDeleteTrack(track.id, playlist?.idPlaylist);
                        }}
                        className="bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 hover:scale-110 transition-all duration-200"
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
                        <GiMusicSpell size={20} />
                      </button>
                    </div>
                    {/* Affichage conditionnel du lecteur audio */}
                    {playingTrackId === track.id && (
                      <audio className="hidden" controls autoPlay>
                        <source src={track.preview} type="audio/mpeg" />
                        Votre navigateur ne supporte pas l'élément audio.
                      </audio>
                    )}

                  </div>

                ))
              ) : (
                <p className="text-gray-400">No tracks found</p>
              )}
            </div>

          </div>
          {idFav && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out opacity-100">
              <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md transform transition-transform duration-300 ease-in-out scale-95 hover:scale-100">
                <h2 className="text-2xl font-semibold text-white mb-6">Add to favorite ?</h2>

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
      ) : (
        // Affichage si non authentifié
        <div className="flex justify-center items-center w-full h-screen">
          <div className="max-w-md text-center bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold text-white mb-4">Limited Access</h1>
            <p className="text-lg text-gray-300 mb-6">
              Log in to access your playlists, manage your favorites, and enjoy
              a personalized music experience.
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
        </div>
      )
      }
    </div >
  );
}


