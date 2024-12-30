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
        <div className="mx-auto px-4 fade-in">
            {/* Barre de recherche */}
            <SearchBar value={searchValue} onChange={setSearchValue} placeholder='find your album' />
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
                <div className="text-center text-gray-400 mt-6">
                    No album found.
                </div>
            )
            }
        </div>
    )
}
