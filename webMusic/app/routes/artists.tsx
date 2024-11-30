import React, { useEffect, useState } from 'react';
import { getGenre, getArtistsByGenre } from '../lib/Music';
import { useLoaderData } from '@remix-run/react';
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

    return (
        <div className="container mx-auto px-4">
            <SearchBar value={artistSearch} onChange={setArtistSearch} />
            {/* Dropdown des genres et bouton de soumission */}
            <div className="flex justify-center items-center mt-6">
                <label className="relative mr-4">
                    <select
                        value={idGenres} // Afficher la valeur actuelle du genre sélectionné
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {artists.length === 0 && !loading ? (
                    <div className="text-center text-gray-400">
                        Aucun artiste disponible pour le moment.
                    </div>
                ) : (
                    artists.map((artist) => (
                        <div
                            key={artist.id}
                            className="p-4 rounded-lg shadow-md hover:shadow-2xl transition duration-300 ease-in-out hover:scale-105 fade-in"
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
        </div>
    );
}
