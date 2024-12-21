import { useNavigate } from '@remix-run/react';
import React, { useEffect, useState } from 'react'
import SearchBar from '~/components/SearchBar';
import { searchGlobal } from '~/lib/Music';

export default function SearchArtist() {

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
                const results = await searchGlobal('artist', searchValue);
                const totalResults = results?.data || [];
                setSearchResults(totalResults);
            };

            fetchSearchResults();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchValue]);

    const handleClickArtist = (idArtist: number) => {
        navigate(`/artistDetails/${idArtist}`);
    };

    return (
        <div className="mx-auto px-4 fade-in">
            {/* Barre de recherche */}
            <SearchBar value={searchValue} onChange={setSearchValue} placeholder='find your artist' />
            {/* Affichage des résultats de recherche si une recherche est effectuée */}
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
                <p className="text-center text-gray-400 mt-6">No results found.</p>
            )}
        </div>
    )
}
