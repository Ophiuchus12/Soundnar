import { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import React from 'react'
import { getMe, verify } from '~/lib/User';
import { getSession } from '~/session.server';

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request.headers.get("Cookie"));
    const token = session.get("authToken");
    let userId: string = "";

    if (!token) {
        return { isAuthenticated: false, error: null, token: null };
    } else {
        const response = await getMe(token);
        if (response && response.user) {
            userId = response.user.id.toString();
        }
    }

    const isValid = await verify(token);
    if (!isValid) {
        return { isAuthenticated: false, error: null, token: null };
    }

    return { isAuthenticated: true, error: null, token: token, userId: userId };
}

export default function Playlists() {
    const { isAuthenticated, token, userName, error } = useLoaderData<{
        isAuthenticated: boolean;
        token: string | null;
        userName: string | null;
        error: string | null;
    }>();

    return (
        <div className="p-4 text-white">
            {isAuthenticated ? (
                <div>
                    <h1>Welcome, {userName}</h1>
                    <p>Your Playlists</p>
                </div>
            ) : (
                <p>Please log in to view your playlists.</p>
            )}
        </div>
    );
}

