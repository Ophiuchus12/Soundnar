import { useNavigate } from '@remix-run/react';
import React, { useEffect, useState } from 'react';
import SearchBar from '~/components/SearchBar';
import { searchGlobal } from '~/lib/Music';
import { Track } from '~/types';

export default function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    // Pagination (désactivée)
    // const [currentPage, setCurrentPage] = useState(1);
    // const [hasMore, setHasMore] = useState(false);

    const navigate = useNavigate();

    // Nombre de résultats par page (inutile si pagination désactivée)
    // const RESULTS_PER_PAGE = 8;

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchValue.trim() === '') {
                setSearchResults([]);
                // setHasMore(false); // Pagination désactivée
                return;
            }

            const fetchSearchResults = async () => {
                const results = await searchGlobal('all', searchValue);
                const totalResults = results?.data || [];
                setSearchResults(totalResults); // Charge tous les résultats directement
                // setHasMore(false); // Pagination désactivée
            };

            fetchSearchResults();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchValue]);

    // Fonction de chargement de plus de résultats (désactivée)
    /*
    const loadMoreResults = async () => {
        const nextPageStart = currentPage * RESULTS_PER_PAGE;
        const nextPageEnd = nextPageStart + RESULTS_PER_PAGE;

        const results = await searchGlobal('all', searchValue);
        const totalResults = results?.data || [];

        setSearchResults((prevResults: Track[]) => [
            ...prevResults,
            ...totalResults.slice(nextPageStart, nextPageEnd),
        ]);

        setHasMore(nextPageEnd < totalResults.length);
        setCurrentPage((prev) => prev + 1);
    };
    */

    const handleClickArtist = (idArtist: number) => {
        navigate(`/artistDetails/${idArtist}`);
    };

    const handleClickAlbum = (idAlbum: number) => {
        navigate(`/albumDetails/${idAlbum}`);
    };

    return (
        <div className="mx-auto px-4 fade-in">
            {/* Barre de recherche */}
            <SearchBar value={searchValue} onChange={setSearchValue} placeholder='find your inspiration' />

            {/* Affichage des résultats */}
            {searchResults.length > 0 ? (
                <div className="mt-6">
                    <div className="flex gap-6">
                        {/* Tracks - boîte à gauche */}
                        <div className="flex-1 bg-gray-800 p-4 rounded-lg overflow-y-auto" style={{ maxHeight: '400px' }}>
                            <h2 className="text-white text-2xl mb-4">Tracks</h2>
                            <div className="flex flex-col gap-4">
                                {searchResults.map((track: any) => (
                                    <div
                                        key={track.id}
                                        className="flex items-center bg-gray-900 p-4 rounded-lg hover:bg-gray-700 transition cursor-pointer"
                                    >
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
                                        {/* Audio Preview */}
                                        <audio controls src={track.preview} className="ml-4 w-24">
                                            Your browser does not support the audio element.
                                        </audio>
                                    </div>
                                ))}
                            </div>
                            {/* Bouton "Load More" désactivé */}
                            {/*
                            {hasMore && (
                                <button
                                    onClick={loadMoreResults}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition w-full"
                                >
                                    Load More
                                </button>
                            )}
                            */}
                        </div>

                        {/* Artists - boîte à droite */}
                        <div className="flex-1 bg-gray-800 p-4 rounded-lg overflow-y-auto" style={{ maxHeight: '400px' }}>
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
                                        item.album.id, // Clé unique pour chaque album
                                        {
                                            album: item.album,
                                            artist: item.artist, // Inclure les infos de l'artiste
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
                <p className="text-center text-gray-400 mt-6">No results found.</p>
            )}
        </div>
    );
}
