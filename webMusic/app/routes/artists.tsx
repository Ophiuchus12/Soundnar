import React, { useEffect, useState } from 'react';
import { getGenre, getArtistsByGenre, searchArtist } from '../lib/Music';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { Genre, Artist } from '../types';
import "../styles/index.css";
import SearchBar from '~/components/SearchBar';

export async function loader() {
    const allGenres = await getGenre();
    return { genres: allGenres?.data || [] }; // Assurez-vous que genres est toujours un tableau
}

export default function Artists() {
    const { genres } = useLoaderData<{ genres: Genre[] }>();
    const [idGenres, setIdGenres] = useState<number>(0); // Initialiser avec "Tout" (id = 0)
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState<boolean>(false); // Gestion du chargement
    const [artistSearch, setArtistSearch] = useState("");
    const [searchResults, setSearchResults] = useState<any | null>(null);

    const navigate = useNavigate();

    const searchArtistByGenre = async (idGenre: number) => {
        try {
            setLoading(true);
            const response = await getArtistsByGenre(idGenre);
            if (response?.data) {
                setArtists(response.data);
            } else {
                setArtists([]);
            }
        } catch (error) {
            console.error('Erreur dans la récupération des artistes', error);
            setArtists([]);
        } finally {
            setLoading(false);
        }
    };

    // Appeler la recherche automatiquement lors du premier rendu (effet de chargement initial)
    useEffect(() => {
        searchArtistByGenre(idGenres);
    }, [idGenres]); // Effectuer la recherche dès que le genre est modifié

    useEffect(() => {
        if (artistSearch.trim() === "") {
            setSearchResults(null);
            return;
        }

        const fetchSearchResults = async () => {
            const results = await searchArtist(artistSearch);
            setSearchResults(results?.data || []);
        };

        fetchSearchResults();
    }, [artistSearch]);

    const handleClickArtist = (idArtist: number) => {
        navigate(`/artistDetails/${idArtist}`);
    };

    return (
        <div className="mx-auto px-4 fade-in">
            {/* Barre de recherche */}
            <SearchBar value={artistSearch} onChange={setArtistSearch} />

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
                /* Si aucune recherche n'est effectuée, afficher le menu des genres et les artistes */
                <>
                    <div className="flex justify-center items-center mt-6">
                        <label className="relative mr-4">
                            <select
                                value={idGenres}
                                onChange={(e) => setIdGenres(parseInt(e.target.value, 10))}
                                className="bg-gray-800 text-white py-2 px-4 rounded-lg border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-300 ease-in-out hover:bg-gray-700"
                            >
                                {genres.map((genre) => (
                                    <option key={genre.id} value={genre.id}>
                                        {genre.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {/* Liste des artistes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-8">
                        {loading ? (
                            <div className="text-center text-gray-400">Chargement...</div>
                        ) : artists.length === 0 ? (
                            <div className="text-center text-gray-400">
                                Aucun artiste disponible pour le moment.
                            </div>
                        ) : (
                            artists.map((artist) => (
                                <div
                                    key={artist.id}
                                    className="p-4 rounded-lg shadow-md hover:shadow-2xl transition duration-300 ease-in-out hover:scale-105"
                                    onClick={() => handleClickArtist(artist.id)}
                                >
                                    <img
                                        src={artist.picture_medium}
                                        alt={artist.name}
                                        className="rounded-full mb-4 w-full object-cover border-2 border-opacity-40 border-white"
                                    />
                                    <h2 className="text-white text-lg font-bold text-center">{artist.name}</h2>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );

}    