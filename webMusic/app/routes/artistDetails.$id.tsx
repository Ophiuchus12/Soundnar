import { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react';
import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { getArtist, getArtistAlbums } from '~/lib/Music';
import { ArtistDetail, ArtistDetailAlbum, ArtistDetailAlbumList } from '~/types';

export async function loader({ params }: LoaderFunctionArgs) {
    const { id } = params;

    if (!id) {
        throw new Error('Missing artist ID');
    }

    const artistData = await getArtist(Number(id));
    if (!artistData) {
        console.error('Failed to fetch artist');
        return null;
    }

    const artistDataAlbums = await getArtistAlbums(Number(id))
    if (!artistDataAlbums) {
        console.error('Failed to fetch artist albums');
        return null;
    }
    return { artistData: artistData, artistDataAlbums: artistDataAlbums }

}


export default function ArtistDetails() {

    const { artistData, artistDataAlbums } = useLoaderData<{ artistData: ArtistDetail, artistDataAlbums: ArtistDetailAlbumList }>();
    const navigate = useNavigate();

    const handleClickAlbum = (idAlbum: number) => {
        navigate(`/albumDetails?album=${idAlbum}`)
    };

    return (
        <div className='w-full h-full min-h-screen flex flex-col mt-10 bg-black fade-in'>

            <div className=" flex ml-8">
                <button
                    onClick={() => navigate(-1)}
                    className=" text-white text-3xl p-2 rounded-full bg-[#6a00ab] hover:bg-[#3b1d79] transition-all z-40"
                    aria-label="Go back to home"
                >
                    <FaArrowLeft />
                </button>

            </div>
            <div className="relative px-6 pt-24">
                <div className="mx-auto max-w-6xl">
                    <div className="flex flex-col items-center space-y-6">
                        {/* Artist Image */}
                        <div className="group relative">
                            <div className="absolute -inset-1 animate-pulse rounded-full bg-gradient-to-r from-purple-600 to-purple-900 opacity-75 blur-lg transition-all group-hover:opacity-100" />
                            <div className="relative h-64 w-64 overflow-hidden rounded-full border-2 border-purple-500/50">
                                <img
                                    src={artistData?.picture_big}
                                    alt={artistData?.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                        </div>

                        {/* Artist Info */}
                        <div className="text-center">
                            <h1 className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 bg-clip-text text-4xl font-bold text-transparent">
                                {artistData?.name}
                            </h1>
                            <p className="mt-2 text-gray-400">
                                {new Intl.NumberFormat().format(artistData?.nb_fan)} fans
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description Section */}
            <div className="mx-auto max-w-4xl px-6 py-12">
                <h2 className="mb-4 text-2xl font-bold text-white">About</h2>
                <div className="rounded-xl bg-gray-900/50 p-6 backdrop-blur-sm">
                    <p className="text-gray-300">
                        Description de l'artist ici ârocur vbefncebz bncizheubcz cbhbcurbebcvuh al P ZFNP YEZKENB vrevie ivu
                    </p>
                </div>
            </div>

            {/* Albums Grid */}
            <div className="mx-auto max-w-7xl px-6 pb-20">
                <h2 className="mb-8 text-2xl font-bold text-white">Albums</h2>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {artistDataAlbums.data.map((album) => (
                        <button
                            key={album.id}
                            onClick={() => handleClickAlbum(album.id)}
                            className="group relative overflow-hidden rounded-xl bg-gray-800/50 p-3 transition-all duration-300 hover:-translate-y-1 hover:bg-gray-800"
                        >
                            {/* Album Cover */}
                            <div className="aspect-square overflow-hidden rounded-lg">
                                <img
                                    src={album.cover_medium}
                                    alt={album.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </div>

                            {/* Album Title */}
                            <h3 className="mt-3 truncate text-sm font-medium text-gray-200 transition-colors group-hover:text-white">
                                {album.title}
                            </h3>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
