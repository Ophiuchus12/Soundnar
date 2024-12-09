import { Request, Response } from "express";
import { fetchChartAlbums, fetchChartArtists, fetchGenres, fetchArtistsByGenre, fetchChartTracks, fetchAlbum, fetchArtist, fetchArtistAlbum } from "../services/musicServices";

export async function getChartAlbums(_: Request, res: Response): Promise<void> {
    try {
        const chartData = await fetchChartAlbums();
        if (!chartData) {
            res.status(404).json({ message: "Album not found" });
            return;
        }
        res.status(200).json(chartData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la récuếration des données albums" });


    }
}


export async function getChartArtists(_: Request, res: Response): Promise<void> {
    try {
        const chartData = await fetchChartArtists();
        if (!chartData) {
            res.status(404).json({ message: "Artists not found" });
            return;
        }
        res.status(200).json(chartData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la récuération des données des artistes" });
    }
}

export async function getChartTracks(_: Request, res: Response): Promise<void> {
    try {
        const chartData = await fetchChartTracks();
        if (!chartData) {
            res.status(404).json({ message: "Tracks not found" });
            return;
        }
        res.status(200).json(chartData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la récuération des données des pistes du chart" });
    }
}

export async function getGenres(req: Request, res: Response): Promise<void> {
    try {
        const genresData = await fetchGenres();
        if (!genresData) {
            res.status(404).json({ message: "Genres not found" });
            return;
        }
        res.status(200).json(genresData);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la récuération des données genres" });
    }
}

export async function getArtistsGenre(req: Request, res: Response): Promise<void> {
    try {
        const genreId = parseInt(req.params.id);
        console.log(`genreId: ${genreId}`);
        const artistsData = await fetchArtistsByGenre(genreId);
        if (!artistsData) {
            res.status(404).json({ message: "Artists in the genre not found" });
            return;
        }
        res.status(200).json(artistsData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la récuération des données des artistes par genre" });
    }
}

export async function getSingleAlbum(req: Request, res: Response): Promise<void> {
    try {
        const albumId = parseInt(req.params.idAlbum);
        const albumData = await fetchAlbum(albumId);
        if (!albumData) {
            res.status(404).json({ message: "Album not found" });
            return;
        }
        res.status(200).json(albumData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la récuération des données de l'album" });
    }
}


export async function getSingleArtist(req: Request, res: Response): Promise<void> {
    try {
        const artistId = parseInt(req.params.idArtist);
        const artistData = await fetchArtist(artistId);
        if (!artistData) {
            res.status(404).json({ message: "Artist not found" });
            return;
        }
        res.status(200).json(artistData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la récuération des données de l'artiste" });
    }
}

export async function getSingleArtistAlbums(req: Request, res: Response): Promise<void> {
    try {
        const artistId = parseInt(req.params.idArtist);
        const artistData = await fetchArtistAlbum(artistId);
        if (!artistData) {
            res.status(404).json({ message: "Artist Album not found" });
            return;
        }
        res.status(200).json(artistData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la récuération des données de l'artiste" });
    }
}