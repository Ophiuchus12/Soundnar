import "../styles/index.css";
import { getChartAlbums, getChartArtists, getChartTracks, getGenre, searchArtist, searchGlobal } from "../lib/Music";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Album, Artist, Genre, Track } from "../types";
import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import { GiMusicSpell } from "react-icons/gi";
import GenreCarousel from "~/components/GenreCarousel";

export async function loader() {
  const chartAlbum = await getChartAlbums();
  if (!chartAlbum) throw new Error("Failed to fetch chart album");

  const chartArtist = await getChartArtists();
  if (!chartArtist) throw new Error("Failed to fetch chart artists");

  const chartTrack = await getChartTracks();
  if (!chartTrack) throw new Error("Failed to fetch chart tracks");

  const genreList = await getGenre();
  if (!genreList) throw new Error("Failed to fetch genre list");

  return {
    albums: chartAlbum.data,
    artists: chartArtist.data,
    tracks: chartTrack.data,
    genres: genreList.data,
  };
}

export default function Index() {
  const { albums } = useLoaderData<{ albums: Album[] }>();
  const { artists } = useLoaderData<{ artists: Artist[] }>();
  const { tracks } = useLoaderData<{ tracks: Track[] }>();
  const { genres } = useLoaderData<{ genres: Genre[] }>();
  const [artistSearch, setArtistSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleClickAlbum = (idAlbum: number) => {
    navigate(`/albumDetails/${idAlbum}`);
  };

  const handleClickArtist = (idArtist: number) => {
    navigate(`/artistDetails/${idArtist}`);
  };

  const handlePlayClick = (trackId: number) => {
    setPlayingTrackId(playingTrackId === trackId ? null : trackId);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (artistSearch.trim() === "") {
        setSearchResults(null);
        return;
      }

      const fetchSearchResults = async () => {
        const results = await searchGlobal("artist", artistSearch);
        setSearchResults(results?.data || []);
      };

      fetchSearchResults();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [artistSearch]);

  return (
    <div className="mx-auto px-4 fade-in">
      {/* Barre de recherche */}
      <SearchBar value={artistSearch} onChange={setArtistSearch} placeholder="find your artist" />

      {/* Affichage dynamique en fonction de la recherche */}
      {searchResults ? (
        searchResults.length > 0 ? (
          <div className="w-full bg-opacity-30 p-6 rounded-lg mb-10">
            <h2 className="text-white text-3xl font-semibold text-center mb-6">Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {searchResults.map((artist: any) => (
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
                  <p className="text-sm text-gray-400">Artist</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-6">
            No artists available.
          </div>
        )
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className="bg-black/40 backdrop-blur-sm rounded-xl p-4 transform hover:scale-105 transition-all duration-300 group"
                >
                  <div className="relative mb-4">
                    <img
                      className="w-full h-48 object-cover rounded-lg shadow-lg group-hover:shadow-purple-500/50"
                      src={`https://e-cdns-images.dzcdn.net/images/cover/${track.md5_image}/500x500-000000-80-0-0.jpg`}
                      alt={track.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="flex items-center justify-between space-x-4">
                    <h3 className="font-bold text-white text-lg truncate">{track.title}</h3>
                    <button
                      onClick={() => handlePlayClick(track.id)}
                      className={`rounded-full p-2 transition-all ${playingTrackId === track.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-2xl text-gray-400 hover:bg-purple-900/50 hover:text-white'
                        }`}
                      aria-label={playingTrackId === track.id ? 'Stop' : 'Play'}

                    >
                      <GiMusicSpell />
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm truncate mt-2">by {track.artist.name}</p>

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
        </>
      )}
    </div>
  );
}