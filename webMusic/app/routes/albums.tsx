import { useNavigate } from '@remix-run/react';
import React, { useEffect, useState } from 'react'
import SearchBar from '~/components/SearchBar';
import { searchGlobal } from '~/lib/Music';

export default function Albums() {

    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchValue.trim() === '') {
                setSearchResults([]);
                return;
            }

            const fetchSearchResults = async () => {
                const results = await searchGlobal('album', searchValue);
                const totalResults = results?.data || [];
                setSearchResults(totalResults);
            };

            fetchSearchResults();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchValue]);

    const handleClickAlbum = (idAlbum: number) => {
        navigate(`/albumDetails/${idAlbum}`);
    };

    return (
        <>
            <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4 shadow-md">
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
                </div>
            </header>
            <div className="mx-auto px-4 fade-in">
                {/* Affichage des résultats de recherche si une recherche est effectuée */}
                {searchResults &&
                    searchResults.length > 0 ? (
                    <div className="w-full bg-opacity-30 p-6 rounded-lg mb-10">
                        <h2 className="text-white text-3xl font-semibold text-center mb-6">Search Results</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                            {searchResults.map((album: any) => (
                                <div
                                    key={album.id}
                                    className="text-white text-center flex flex-col items-center hover:scale-105 transition-all duration-300 cursor-pointer"
                                    onClick={() => handleClickAlbum(album.id)}
                                >
                                    <img
                                        className="w-50 h-50 object-cover rounded-s border-2 border-opacity-40 border-white mb-2"
                                        src={album.cover_medium}
                                        alt={album.title}
                                    />
                                    <p className="font-bold">{album.title}</p>
                                    <p className="text-sm text-gray-400">{album.artist.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center mt-12">

                        <h2 className="text-2xl text-white font-semibold mb-4">
                            Oops! No albums found
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Try refining your search or explore our trending albums!
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-purple-700 transition"
                        >
                            Explore Trending Albums
                        </button>
                    </div>
                )
                }
            </div>
        </>
    )
}
