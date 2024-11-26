import "../styles/index.css";
import { getChartAlbums, getChartArtists, getChartTracks } from "../lib/Music"
import { useLoaderData } from "@remix-run/react";
import { Album, Artist, ChartAllAlbums, Track } from "../types"
import { useState } from "react";
import SearchBar from "../components/SearchBar";


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

  return (
    <div className="w-full h-full min-h-screen flex flex-col items-center justify-center bg-black">
      {/* Barre de recherche */}
      <SearchBar value={artistSearch} onChange={setArtistSearch} />

      {/* Liste des albums */}
      <div className="w-full bg-opacity-30 p-6 rounded-lg mb-10">
        <h2 className="text-white text-3xl font-semibold text-center mb-6">Top Albums</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {albums.map((album) => (
            <div key={album.id} className="text-white text-center flex flex-col items-center">
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
      {/* Liste des albums */}
      <div className="w-full bg-opacity-30 p-6 rounded-lg mb-10">
        <h2 className="text-white text-3xl font-semibold text-center mb-6">Top Artists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {artists.map((artist) => (
            <div key={artist.id} className="text-white text-center flex flex-col items-center">
              <img
                className="w-50 h-50 object-cover rounded-full border-2 border-opacity-40 border-[#7600be] mb-2"
                src={artist.picture_medium}
                alt={artist.name}
              />
              <p className="font-bold">{artist.name}</p>
              <p className="text-sm text-gray-400">n° {artist.position}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Liste des albums */}
      <div className="w-full bg-[#7600be] bg-opacity-30 p-6 rounded-lg mb-10">
        <h2 className="text-white text-2xl font-semibold text-center mb-6">Top Tracks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {tracks.map((track) => (
            <div key={track.id} className="text-white text-center flex flex-col items-center">  {/*onClick={()=>RiEn()} */}
              <img
                className="w-50 h-50 object-cover rounded-lg mb-2"
                src={track.album.cover_medium}
                alt={track.title}
              />
              <p className="font-bold">{track.title}</p>
              <p className="text-sm text-gray-400">by {track.artist.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

}
