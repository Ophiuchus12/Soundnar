import { LoaderFunction } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react';
import React from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { getPlaylistById } from '~/lib/Playlist';
import { getMe, verify } from '~/lib/User';
import { getSession } from '~/session.server'
import { PlaylistPerso } from '~/types';



export const loader: LoaderFunction = async ({ request, params }) => {
  try {
    const session = await getSession(request.headers.get("Cookie"));
    const token = session.get("authToken");

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
    }

    const playlistId = params.id;
    if (!playlistId) {
      return {
        isAuthenticated: true, error: "Playlist ID not provided", token, playlist: null,
      };
    }

    const playlist = await getPlaylistById(playlistId);
    if (!playlist) {
      return {
        isAuthenticated: true, error: "Playlist not found", token, playlist: null,
      };
    }

    return {
      isAuthenticated: true, error: null, token, playlist,
    };
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return {
      isAuthenticated: false,
      error: "An unexpected error occurred",
      token: null,
      playlist: null,
    };
  }
};
export default function PlaylistDetails() {

  const { isAuthenticated, token, playlist, error } = useLoaderData<{
    isAuthenticated: boolean;
    token: string | null;
    playlist: PlaylistPerso | null;
    error: string | null;
  }>();

  //const [tracks, setTracks] = useState([]: Track);

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
          <div className="text-white mx-8">
            {/* {playlist ? (
              playlist.songs.length > 0 && (
                playlist.songs.map()
              )
            ) : ()} */}
          </div>
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
      )}
    </div>
  );
}


