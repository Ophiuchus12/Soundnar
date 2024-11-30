import { LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react';
import React, { useEffect, useState } from 'react'
import { getAlbum } from '~/lib/Music';
import { AlbumDetail } from '../types';


export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const albumId = url.searchParams.get('album');
    return { albumId: albumId }
}
export default function AlbumDetails() {

    const { albumId } = useLoaderData<{ albumId: string }>();
    const albumIdNumber = Number(albumId);  // Conversion en nombre
    const [albumDetails, setAlbumDetails] = useState<AlbumDetail | null>(null);



    useEffect(() => {
        const fetchAlbum = async () => {
            if (albumId) {
                const albumData = await getAlbum(Number(albumId));  // Utilisation de `Number(albumId)`
                if (albumData) {
                    setAlbumDetails(albumData);
                } else {
                    console.error('Failed to fetch album');
                }
            }
        };

        fetchAlbum();
    }, [albumId]);

    return (
        <div className='mt-8'>
            <h1 className='text-white'>{albumDetails?.title}</h1>
            <h2 className='text-gray-400'>{albumDetails?.artist.name}</h2>
            {/* Afficher d'autres informations sur l'album ici */}
        </div>
    )
}
