import "../styles/index.css";
import { getChartAlbums, getChartArtists, getChartTracks, getGenre, searchArtist, searchGlobal } from "../lib/Music";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { Album, Artist, Genre, PlaylistPerso, Track } from "../types";
import { useEffect, useState } from "react";
import { GiMusicSpell } from "react-icons/gi";
import GenreCarousel from "~/components/GenreCarousel";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { commitSession, getSession } from "~/session.server";
import { getMe, verify } from "~/lib/User";
import { PiMusicNotesPlus } from "react-icons/pi";
import AddMenu from "~/components/addMenu";
import { addTrackFavorite, getAllPlaylists } from "~/lib/Playlist";
import { CiCirclePlus } from "react-icons/ci";

export const loader: LoaderFunction = async ({ request }) => {
  // Handle session and authentication
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("authToken");
  const error = session.get("error") || null;

  console.log("sessiion", token)

  if (error) {
    session.unset("error");
  }

  let isAuthenticated = undefined;
  let userName: string = "";
  let userId: string = "";
  if (token) {
    isAuthenticated = await verify(token);
    console.log(isAuthenticated)
    const response = await getMe(token);
    console.log(response)
    //console.log(response);
    if (response?.user) {
      userName = response.user.username;
      userId = response.user.id.toString();
    }
  }
  const playlists = await getAllPlaylists(userId);

  //console.log("nom", userName);

  // Fetch required data
  try {
    const [chartAlbum, chartArtist, chartTrack, genreList] = await Promise.all([
      getChartAlbums(),
      getChartArtists(),
      getChartTracks(),
      getGenre(),
    ]);

    if (!chartAlbum || !chartArtist || !chartTrack || !genreList) {
      throw new Error("Failed to fetch all necessary data");
    }

    // Return response as JSON
    return new Response(
      JSON.stringify({
        isAuthenticated,
        token,
        error,
        userName,
        userId,
        playlists,
        albums: chartAlbum.data,
        artists: chartArtist.data,
        tracks: chartTrack.data,
        genres: genreList.data,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  } catch (err) {
    // Handle errors gracefully
    return new Response(
      JSON.stringify({
        isAuthenticated,
        token,
        userName,
        userId,
        playlists,
        error: error,
        albums: [],
        artists: [],
        tracks: [],
        genres: [],
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  }
};


export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();

  //get value
  const _logout = formData.get("_logout");

  if (_logout) {
    session.unset("authToken");
    return new Response(null, {
      status: 303,
      headers: {
        Location: "/",
        "Set-Cookie": await commitSession(session),
      },
    })
  }
}


export default function Index() {
  const { albums, artists, tracks, genres, isAuthenticated, token, userName, userId, error, playlists } = useLoaderData<{
    albums: Album[];
    artists: Artist[];
    tracks: Track[];
    genres: Genre[];
    isAuthenticated: boolean;
    playlists: PlaylistPerso[];
    token: string | null;
    userName: string | null;
    userId: string;
    error: string | null;
  }>();

  //console.log("test", isAuthenticated)


  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [idFav, setIdFav] = useState<string | null>("");

  const navigate = useNavigate();

  const [addMenuTrackId, setAddMenuTrackId] = useState<string | null>(null);


  const toggleAddMenu = (trackId: string) => {
    //console.log("trackId", trackId);
    setAddMenuTrackId(addMenuTrackId === trackId ? null : trackId);
    console.log("add", addMenuTrackId);
  };

  const handlePlayClick = (trackId: string) => {
    setPlayingTrackId(playingTrackId === trackId ? null : trackId);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchValue.trim() === "") {
        setSearchResults([]);
        return;
      }

      const fetchSearchResults = async () => {
        const results = await searchGlobal("all", searchValue);
        setSearchResults(results?.data || []);
      };

      fetchSearchResults();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchValue]);
  const handleClickArtist = (idArtist: number) => {
    navigate(`/artistDetails/${idArtist}`);
  };

  const handleClickAlbum = (idAlbum: number) => {
    navigate(`/albumDetails/${idAlbum}`);
  };

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
    } catch (error) {
      console.error("Error adding track to favorites:", error);
    }
  };

  const toggleForm = () => { setIdFav(null); }

  return (
    <>
      {/* Header Section */}
      <header className=" text-white p-4 shadow-md ">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <h1
            className="text-3xl font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            Soundnar
          </h1>

          {/* Barre de recherche */}
          <div className="flex items-center w-full max-w-md mx-4">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Find your inspiration"
              className="w-full p-2 rounded-lg text-gray-900"
            />
          </div>

          {/* Bouton de connexion */}
          {!isAuthenticated ? (
            <button
              onClick={() => navigate("/auth")}
              className="bg-white text-purple-600 font-semibold px-4 py-2 rounded-lg shadow hover:bg-purple-600 hover:text-white transition"
            >
              Login
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-white text-purple-600 px-3 py-1 rounded-full shadow">
                <GiMusicSpell className="w-6 h-6 mr-2" />
                <span>Hello {userName ? userName : "Guest"}</span>
              </div>
              <Form method="post">
                <button
                  type="submit"
                  name="_logout"
                  value="true"
                  className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </Form>
            </div>


          )}

        </div>
      </header >
      <div className="mx-auto px-4 fade-in">

        {/* Affichage des résultats */}
        {searchResults.length > 0 ? (
          <div className="mt-6">
            <div className="flex gap-6">
              {/* Tracks - boîte à gauche */}
              <div
                className="flex-1 bg-gray-800 p-4 rounded-lg overflow-y-auto"
                style={{ maxHeight: "400px" }}
              >
                <h2 className="text-white text-2xl mb-4">Tracks</h2>
                <div className="flex flex-col gap-4">
                  {searchResults.map((track: any) => (
                    <div
                      key={track.id}
                      className="flex items-center bg-gray-900 p-4 rounded-lg hover:bg-gray-700 transition cursor-pointer"
                    >
                      {/* Bouton + avant l'image */}
                      <button
                        onClick={() => setIdFav(track.id)} // Ajouter aux favoris
                        className="rounded-full p-2 mr-3 transition-all bg-gray-800 text-gray-400 hover:bg-purple-900/50 hover:text-white"
                        aria-label="Add to Favorites"
                      >
                        <CiCirclePlus className="w-6 h-6 text-white" />
                      </button>

                      {/* Thumbnail */}
                      <img
                        src={`https://e-cdns-images.dzcdn.net/images/cover/${track.md5_image}/250x250-000000-80-0-0.jpg`}
                        alt={track.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />

                      {/* Details */}
                      <div className="ml-4 flex-1">
                        <h3 className="text-white text-base font-medium">{track.title}</h3>
                        <p className="text-gray-400 text-sm">by {track.artist.name}</p>
                      </div>

                      {/* Actions */}
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

                      {playingTrackId === track.id && (
                        <audio className="hidden" controls autoPlay>
                          <source src={track.preview} type="audio/mpeg" />
                          Votre navigateur ne supporte pas l'élément audio.
                        </audio>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Artists - boîte à droite */}
              <div
                className="flex-1 bg-gray-800 p-4 rounded-lg overflow-y-auto"
                style={{ maxHeight: "400px" }}
              >
                <h2 className="text-white text-2xl mb-4">Artists</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[
                    ...new Map(
                      searchResults.map((item: any) => [item.artist.id, item.artist])
                    ).values(),
                  ].map((artist: any) => (
                    <div
                      key={artist.id}
                      className="text-center cursor-pointer"
                      onClick={() => handleClickArtist(artist.id)}
                    >
                      <img
                        src={artist.picture_medium}
                        alt={artist.name}
                        className="w-32 h-32 object-cover rounded-full mx-auto mb-2"
                      />
                      <h3 className="text-white text-lg">{artist.name}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Albums en dessous */}
            <div className="mt-8">
              <h2 className="text-white text-2xl mb-4">Albums</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[
                  ...new Map<string, { album: any; artist: any }>(
                    searchResults.map((item: any) => [
                      item.album.id,
                      {
                        album: item.album,
                        artist: item.artist,
                      },
                    ])
                  ).values(),
                ].map(({ album, artist }) => (
                  <div
                    key={album.id}
                    className="text-center cursor-pointer"
                    onClick={() => handleClickAlbum(album.id)}
                  >
                    <img
                      src={album.cover_medium}
                      alt={album.title}
                      className="w-32 h-32 object-cover rounded-lg mx-auto mb-2"
                    />
                    <h3 className="text-white text-lg">{album.title}</h3>
                    <p className="text-gray-400 text-sm">by {artist.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Liste des genres */}
            <GenreCarousel genres={genres} />

            {/* Liste des albums */}
            <div className="w-full bg-opacity-30 p-6 rounded-lg mb-10">
              <h2 className="text-white text-3xl font-semibold text-center mb-6">Top Albums</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {albums.map((album) => (
                  <div
                    key={album.id}
                    className="text-white text-center flex flex-col items-center hover:scale-105 transition-all duration-300 cursor-pointer"
                    onClick={() => handleClickAlbum(album.id)}
                  >
                    <img
                      className="w-50 h-50 object-cover rounded-lg border-2 border-opacity-40 border-white mb-2"
                      src={album.cover_medium}
                      alt={album.title}
                    />
                    <p className="font-bold">{album.title}</p>
                    <p className="text-sm text-gray-400">by {album.artist.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Liste des artistes */}
            <div className="w-full bg-opacity-30 p-6 rounded-lg mb-10">
              <h2 className="text-white text-3xl font-semibold text-center mb-6">Top Artists</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {artists.map((artist) => (
                  <div
                    key={artist.id}
                    className="text-white text-center flex flex-col items-center hover:scale-105 transition-all duration-300 cursor-pointer"
                    onClick={() => handleClickArtist(artist.id)}
                  >
                    <img
                      className="w-50 h-50 object-cover rounded-full border-2 border-opacity-40 border-white mb-2"
                      src={artist.picture_medium}
                      alt={artist.name}
                    />
                    <p className="font-bold">{artist.name}</p>
                    <p className="text-sm text-gray-400">n° {artist.position}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Liste des morceaux */}
            <div className="w-full bg-black p-6 rounded-lg mb-10">
              <h2 className="text-white text-3xl font-semibold text-center mb-8">Top Tracks</h2>

              {/* Grille des tracks */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    className="bg-black/40 backdrop-blur-sm rounded-xl p-4 transform hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="relative mb-4">
                      {/* Image de la track */}
                      <img
                        className="w-full h-48 object-cover rounded-lg shadow-lg group-hover:shadow-purple-500/50"
                        src={`https://e-cdns-images.dzcdn.net/images/cover/${track.md5_image}/500x500-000000-80-0-0.jpg`}
                        alt={track.title}
                      />

                      {/* Overlay foncé au hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Bouton "Add to playlist" */}
                      {isAuthenticated && (
                        <button
                          onClick={() => toggleAddMenu(track.id)}
                          className="absolute top-2 right-2 p-2 rounded-full bg-gray-800 hover:bg-purple-600 text-gray-400 hover:text-white transition-all shadow-md opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                          aria-label="Add to playlist"
                        >
                          <PiMusicNotesPlus className="h-6 w-6 text-white" />
                        </button>
                      )}
                    </div>

                    {/* Infos de la track */}
                    <div className="flex items-center justify-between space-x-4">
                      <h3 className="font-bold text-white text-lg truncate">{track.title}</h3>

                      <button
                        onClick={() => handlePlayClick(track.id)}
                        className={`rounded-full p-2 transition-all ${playingTrackId === track.id
                          ? "bg-purple-600 text-white"
                          : "bg-gray-800 text-2xl text-gray-400 hover:bg-purple-900/50 hover:text-white"
                          }`}
                        aria-label={playingTrackId === track.id ? "Stop" : "Play"}
                      >
                        <GiMusicSpell className="text-white" />
                      </button>
                    </div>
                    <p className="text-gray-400 text-sm truncate mt-2">by {track.artist.name}</p>
                  </div>
                ))}
              </div>

              {/* Affichage conditionnel du menu d'ajout */}
              {addMenuTrackId && (
                <AddMenu
                  idTrackDeezer={addMenuTrackId}
                  playlists={playlists}
                  onClose={() => setAddMenuTrackId(null)}
                />
              )}
            </div>



          </>
        )}

        {idFav && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out opacity-100">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md transform transition-transform duration-300 ease-in-out scale-95 hover:scale-100">
              <h2 className="text-2xl font-semibold text-white mb-6">Add to favorite ?</h2>

              <div className="flex justify-between items-center mt-6">
                <button
                  type="button"
                  className="bg-[#7600be] hover:bg-[#8c00c8] text-white py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
                  onClick={addFavorite}
                >
                  Add to favorite
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

            </div>
          </div>
        )}
      </div >
    </>
  );
}