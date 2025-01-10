import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { getArtistsByGenre } from '~/lib/Music';
import { Artist } from '~/types';

export async function loader({ params }: LoaderFunctionArgs) {

    console.log("params received", params);

    const idGenre = params.id;
    console.log("id transfere", idGenre);

    if (!idGenre) {
        throw new Error('Missing genre ID');
    }

    // Assurez-vous d'attendre les données si `getArtistsByGenre` est une fonction asynchrone
    const artists = await getArtistsByGenre(Number(idGenre));
    // console.log("liste artists", artists);

    return { artists: artists?.data };
}

export default function GenreArtist() {
    const { artists } = useLoaderData<{ artists: Artist[] }>();

    const navigate = useNavigate();

    const handleClickArtist = (idArtist: number) => {
        navigate(`/artistDetails/${idArtist}`);
    };

    return (
        <div className="mx-auto px-4 fade-in">
            <div className=" flex ml-8">
                <button
                    onClick={() => navigate(-1)}
                    className=" text-white text-3xl p-2 rounded-full bg-[#6a00ab] hover:bg-[#3b1d79] transition-all z-40"
                    aria-label="Go back to home"
                >
                    <FaArrowLeft />
                </button>

            </div>
            {/* Liste des artistes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-8">
                {artists.length === 0 ? (
                    <div className="text-center text-gray-400">
                        Aucun artiste disponible pour le moment.
                    </div>
                ) : (
                    artists.map((artist) => (
                        <div
                            key={artist.id}
                            className="p-4 rounded-lg shadow-md hover:shadow-2xl transition duration-300 ease-in-out hover:scale-105 cursor-pointer"
                            onClick={() => handleClickArtist(artist.id)}
                        >
                            <img
                                src={artist.picture_medium}
                                alt={artist.name}
                                className="rounded-full mb-4 w-full object-cover border-2 border-purple-500/50"
                            />
                            <h2 className="text-white text-lg font-bold text-center">{artist.name}</h2>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
