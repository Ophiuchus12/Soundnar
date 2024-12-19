import React, { useEffect, useState } from 'react'
import SearchBar from '~/components/SearchBar'
import { searchGlobal } from '~/lib/Music';
import { Track } from '~/types';

export default function Search() {

    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState<any | null>(null);
    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const RESULTS_PER_PAGE = 8;


    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchValue.trim() === "") {
                setSearchResults([]);
                setHasMore(false);
                return;
            }

            const fetchSearchResults = async () => {
                const results = await searchGlobal("all", searchValue);
                const totalResults = results?.data || [];
                setSearchResults(totalResults.slice(0, RESULTS_PER_PAGE));
                setHasMore(totalResults.length > RESULTS_PER_PAGE);
                console.log(results);
            };

            fetchSearchResults();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchValue]);

    const loadMoreResults = async () => {
        const nextPageStart = currentPage * RESULTS_PER_PAGE;
        const nextPageEnd = nextPageStart + RESULTS_PER_PAGE;

        const results = await searchGlobal("all", searchValue);
        const totalResults = results?.data || [];

        setSearchResults((prevResults: Track[]) => [
            ...prevResults,
            ...totalResults.slice(nextPageStart, nextPageEnd),
        ]);

        setHasMore(nextPageEnd < totalResults.length);
        setCurrentPage((prev) => prev + 1);
    };

    return (
        <div className="mx-auto px-4 fade-in ml-4">
            {/* Barre de recherche */}
            <SearchBar value={searchValue} onChange={setSearchValue} />

            {/* Affichage des résultats */}
            {searchResults ? (
                <div className="mt-6">
                    {/* Tracks */}
                    <div>
                        <h2 className="text-white text-2xl mb-4">Tracks</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {searchResults.map((all: any) => (
                                <div
                                    key={all.id}
                                    className="flex items-center bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition"
                                >
                                    {/* Thumbnail */}
                                    <img
                                        src={`https://e-cdns-images.dzcdn.net/images/cover/${all.md5_image}/250x250-000000-80-0-0.jpg`}
                                        alt={all.title}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    {/* Details */}
                                    <div className="ml-4 flex-1">
                                        <h3 className="text-white text-base font-medium">{all.title}</h3>
                                        <p className="text-gray-400 text-sm">by {all.artist.name}</p>
                                    </div>
                                    {/* Audio Preview */}
                                    <audio controls src={all.preview} className="ml-4 w-24">
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Charger plus */}
                    {hasMore && (
                        <button
                            onClick={loadMoreResults}
                            className="mt-8 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
                        >
                            Load More
                        </button>
                    )}


                    {/* Artists */}
                    <div className="mt-8">
                        <h2 className="text-white text-2xl mb-4">Artists</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {searchResults
                                .map((all: any) => (

                                    <div key={all.artist.id} className="text-center">
                                        <img
                                            src={all.artist.picture_medium}
                                            alt={all.artist.name}
                                            className="w-32 h-32 object-cover rounded-full mx-auto mb-2"
                                        />
                                        <h3 className="text-white text-lg">{all.artist.name}</h3>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Albums */}
                    <div className="mt-8">
                        <h2 className="text-white text-2xl mb-4">Albums</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {searchResults
                                .filter((item: any) => item.type === "album")
                                .map((album: any) => (
                                    <div key={album.id} className="text-center">
                                        <img
                                            src={album.cover_medium}
                                            alt={album.title}
                                            className="w-32 h-32 object-cover rounded-lg mx-auto mb-2"
                                        />
                                        <h3 className="text-white text-lg">{album.title}</h3>
                                        <p className="text-gray-400 text-sm">by {album.artist.name}</p>
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
