import "../styles/index.css";
import { getChartAlbums } from "../lib/Music"
import { useLoaderData } from "@remix-run/react";
import { Album, ChartAllAlbums } from "../types"

export async function loader() {
  const chartAlbum = await getChartAlbums();
  if (!chartAlbum) throw new Error("Failed to fetch chart album");

  return {
    albums: chartAlbum.data,
  }
}


export default function Index() {
  const { albums } = useLoaderData<{ albums: Album[] }>();

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="absolute inset-0 bg-cover bg-center flex flex-col items-center">
        <h1 className="text-white text-3xl mb-8">Welcome to the Music App</h1>
        <div className="w-full max-w-3xl bg-gray-800 bg-opacity-75 p-4 rounded-lg">
          <h2 className="text-white text-xl mb-4">Top Albums</h2>
          <div className="space-y-4">
            {albums.map((album) => (
              <div key={album.id} className="text-white">
                <p className="font-bold">{album.title}</p>
                <p className="text-sm text-gray-400">by {album.artist.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}