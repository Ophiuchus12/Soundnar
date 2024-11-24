import axios from "axios";

export interface chartResponse {
    tracks: {
        data: string[];
        total: number;
    };
    albums: {
        data: string[];
        total: number;
    };
    artists: {
        data: string[];
        total: number;
    };
    playlists: {
        data: string[];
        total: number;
    };
    podcasts: {
        data: string[];
        total: number;
    };
}



export async function fetchChart() {
    try {
        const url = "https://api.deezer.com/chart";
        const response = await axios.get<chartResponse>(url);
        return response.data;
    } catch (err) {
        console.error(err);
        return null;
    }

}