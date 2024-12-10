import "../styles/index.css";
import { getChartAlbums, getChartArtists, getChartTracks } from "../lib/Music"
import { redirect, useLoaderData, useNavigate } from "@remix-run/react";
import { Album, Artist, ChartAllAlbums, Track } from "../types"
import { useState } from "react";
import SearchBar from "../components/SearchBar";
import { GiMusicSpell } from "react-icons/gi";


export async function loader() {
  const chartAlbum = await getChartAlbums();
  if (!chartAlbum) throw new Error("Failed to fetch chart album");

  const chartArtist = await getChartArtists();
  if (!chartArtist) throw new Error("Failed to fetch chart artists");

  const chartTrack = await getChartTracks();
  if (!chartTrack) throw new Error("Failed to fetch chart tracks");

  return {
    albums: chartAlbum.data,
    artists: chartArtist.data,
    tracks: chartTrack.data,
  }
}

export default function Index() {
  const { albums } = useLoaderData<{ albums: Album[] }>();
  const { artists } = useLoaderData<{ artists: Artist[] }>();
  const { tracks } = useLoaderData<{ tracks: Track[] }>();
  const [artistSearch, setArtistSearch] = useState("");
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleClickAlbum = (idAlbum: number) => {
    navigate(`/albumDetails/${idAlbum}`);
  };

  const handleClickArtist = (idArtist: number) => {
    console.log('Navigating to artist:', idArtist);
    navigate(`/artistDetails/${idArtist}`);
  };


  const handlePlayClick = (trackId: number) => {
    // Si le morceau cliqué est déjà en lecture, on l'arrête
    setPlayingTrackId(playingTrackId === trackId ? null : trackId);
  };

  return (
    <div className="w-full h-full min-h-screen flex flex-col items-center justify-center bg-black">
      {/* Barre de recherche */}
      <SearchBar value={artistSearch} onChange={setArtistSearch} />

      {/* Liste des albums */}
      <div className="w-full bg-opacity-30 p-6 rounded-lg mb-10">
        <h2 className="text-white text-3xl font-semibold text-center mb-6">Top Albums</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {albums.map((album) => (
            <div key={album.id} className="text-white text-center flex flex-col items-center hover:scale-105 transition-all duration-300" onClick={() => handleClickAlbum(album.id)}>
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
      {/* Liste des artists */}
      <div className="w-full bg-opacity-30 p-6 rounded-lg mb-10">
        <h2 className="text-white text-3xl font-semibold text-center mb-6">Top Artists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {artists.map((artist) => (
            <div key={artist.id} className="text-white text-center flex flex-col items-center hover:scale-105 transition-all duration-300" onClick={() => handleClickArtist(artist.id)}>
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
      {/* Liste des tarcks */}
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

              {/* Titre et bouton sur la même ligne */}
              <div className="flex items-center justify-between space-x-4">
                <h3 className="font-bold text-white text-lg truncate">{track.title}</h3>
                <button
                  onClick={() => handlePlayClick(track.id)}
                  className="text-white text-3xl p-2 rounded-full bg-[#6a00ab] hover:bg-[#3b1d79] transition-all"
                  aria-label="Lire le morceau"
                >
                  <GiMusicSpell />
                </button>
              </div>

              <p className="text-gray-400 text-sm truncate mt-2">by {track.artist.name}</p>

              {/* Rendre conditionnellement le lecteur audio pour le morceau sélectionné */}
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


    </div >
  );

}
