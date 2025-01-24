import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { fetchTrack } from "../services/musicServices";


const prisma = new PrismaClient();

export async function playlistCreation(req: Request, res: Response): Promise<void> {
    try {
        const { title, authorId } = req.body;

        if (!title || typeof title !== "string" || title.trim() === "") {
            res.status(400).json({ message: "Le titre est invalide." });
            return;
        }
        if (!authorId || typeof authorId !== "string") {
            res.status(400).json({ message: "L'id de l'auteur est invalide." });
            return;
        }

        const normalizedTitle = title.trim();

        const existing = await prisma.playlist.findFirst({
            where: {
                title: normalizedTitle,
                authorId: authorId,
            },
        });

        if (existing) {
            res.status(409).json({ message: "Playlist déjà existante." });
            return;
        }

        const playlist = await prisma.playlist.create({
            data: { title: normalizedTitle, authorId },
        });

        res.status(201).json({ message: "Playlist créée avec succès.", playlist });
    } catch (err) {
        console.error(err); // Utile pour le debug en local
        res.status(500).json({ message: "Une erreur interne est survenue." });
    }
}


export async function addTrack(req: Request, res: Response): Promise<void> {
    const { idPlaylist, idTrack } = req.body;

    // Validation des paramètres
    if (!idPlaylist || typeof idPlaylist !== "string") {
        res.status(400).json({ message: "L'identifiant de la playlist est invalide." });
        return;
    }

    if (!idTrack || typeof idTrack !== "number") {
        res.status(400).json({ message: "L'identifiant de la piste est invalide." });
        return;
    }

    try {
        // Récupération des détails de la piste depuis l'API Deezer
        const responseTrack = await fetchTrack(idTrack);

        if (!responseTrack) {
            res.status(404).json({ message: "La piste n'a pas été trouvée sur Deezer." });
            return;
        }

        const idTrackDeezer = idTrack;
        const title = responseTrack.title;
        const duration = parseInt(responseTrack.duration, 10); // Convertir la durée en entier
        const preview = responseTrack.preview;
        const md5Image = responseTrack.md5_image;
        const artistId = responseTrack.artist.id;
        const albumId = responseTrack.album.id;

        // Vérifier si la piste existe déjà dans la base de données
        let track = await prisma.track.findUnique({
            where: {
                idTrackDeezer,
            },
        });

        // Si la piste n'existe pas, l'ajouter à la base de données
        if (!track) {
            track = await prisma.track.create({
                data: {
                    idTrackDeezer,
                    title,
                    duration,
                    preview,
                    md5Image,
                    artistId,
                    albumId,
                },
            });
        }

        // Vérifier si la piste est déjà associée à la playlist
        const playlist = await prisma.playlist.findUnique({
            where: {
                idPlaylist,
            },
            include: {
                songs: true,
            },
        });

        if (!playlist) {
            res.status(404).json({ message: "La playlist n'a pas été trouvée." });
            return;
        }

        const isTrackInPlaylist = playlist.songs.some((song) => song.idTrackDeezer === track.idTrackDeezer);

        if (isTrackInPlaylist) {
            res.status(409).json({ message: "La piste est déjà dans la playlist." });
            return;
        }


        // Ajouter la piste à la playlist
        await prisma.playlist.update({
            where: {
                idPlaylist,
            },
            data: {
                songs: {
                    connect: {
                        idTrack: track.idTrack,
                    },
                },
                nbTracks: playlist.nbTracks + 1,
                tempsPlaylist: playlist.tempsPlaylist + track.duration,
            },
        });

        res.status(200).json({ message: "La piste a été ajoutée à la playlist avec succès." });
    } catch (err) {
        console.error("Erreur dans addTrack:", err);
        res.status(500).json({ message: "Erreur serveur lors de l'ajout de la piste à la playlist." });
    }
}


export async function deleteTrackPlaylist(req: Request, res: Response): Promise<void> {
    const { idPlaylist, idTrack } = req.body;

    // Validation des paramètres
    if (!idPlaylist || typeof idPlaylist !== "string") {
        res.status(400).json({ message: "L'identifiant de la playlist est invalide." });
        return;
    }

    if (!idTrack || typeof idTrack !== "string") {
        res.status(400).json({ message: "L'identifiant de la piste dans la playlist est invalide." });
        return;
    }

    try {
        // Récupération de la playlist et des chansons associées
        const playlist = await prisma.playlist.findUnique({
            where: { idPlaylist },
            include: { songs: true }, // Inclure les chansons associées à la playlist
        });

        if (!playlist) {
            res.status(404).json({ message: "La playlist n'a pas été trouvée." });
            return;
        }

        // Vérifier si la chanson est présente dans la playlist
        const track = playlist.songs.find((song) => song.idTrack === idTrack);

        if (!track) {
            res.status(404).json({ message: "La chanson n'est pas présente dans la playlist." });
            return;
        }

        // Suppression de la chanson de la playlist
        await prisma.playlist.update({
            where: { idPlaylist },
            data: {
                songs: {
                    disconnect: { idTrack: track.idTrack },
                },
                nbTracks: playlist.nbTracks - 1, // Décrémenter le nombre de chansons
                tempsPlaylist: playlist.tempsPlaylist - track.duration, // Réduire le temps total de la playlist
            },
        });

        res.status(200).json({ message: "La chanson a été supprimée de la playlist avec succès." });
    } catch (err) {
        console.error("Erreur dans deleteTrackPlaylist:", err);
        res.status(500).json({ message: "Erreur serveur lors de la suppression de la chanson." });
    }
}



export async function deletePlaylist(req: Request, res: Response): Promise<void> {
    const { idPlaylist } = req.params;

    if (!idPlaylist || typeof idPlaylist !== "string") {
        res.status(400).json({ message: "L'identifiant de la playlist est invalide." });
        return;
    }

    try {
        // Suppression de la playlist
        const deletedPlaylist = await prisma.playlist.delete({
            where: { idPlaylist },
        });

        // Renvoi d'une réponse réussie
        res.status(200).json({ message: "La playlist a été supprimée avec succès.", playlist: deletedPlaylist });
    } catch (error) {
        console.error("Erreur dans deletePlaylist:", error);
        res.status(500).json({ message: "Erreur serveur lors de la suppression de la playlist." });
    }
}


export async function updatePlaylist(req: Request, res: Response): Promise<void> {
    const { idPlaylist } = req.params;
    const { title } = req.body;

    if (!idPlaylist || typeof idPlaylist !== "string") {
        res.status(400).json({ message: "L'identifiant de la playlist est invalide." });
        return;
    }

    if (!title || typeof title !== "string") {
        res.status(400).json({ message: "Le titre de la playlist est requis." });
        return;
    }

    try {
        const updateResponse = await prisma.playlist.update({
            where: { idPlaylist },
            data: { title },
        })

        if (!updateResponse) {
            res.status(404).json({ message: "La playlist n'a pas été trouvée." });
            return;
        }

        res.status(200).json({ message: "Le titre de la playlist a été mis à jour avec succès.", playlist: updateResponse });
    } catch (error) {
        console.error("Erreur dans l'update de la playlist", error);
        res.status(500).json({ message: "Erreur serveur lors de la mise à jour de la playlist." });
    }
}


export async function getAllPlaylists(req: Request, res: Response): Promise<void> {
    const { userId } = req.body;

    if (!userId || typeof userId !== "string") {
        res.status(400).json({ message: "L'identifiant de l'utilisateur est invalide ou manquant." });
        return;
    }

    try {
        const playlists = await prisma.playlist.findMany({
            where: { authorId: userId }, // Utiliser le champ correct du modèle
            include: { songs: true }, // Inclure les chansons associées à la playlist
        });

        res.status(200).json(playlists);
    } catch (error) {
        console.error("Erreur dans getAllPlaylists:", error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération de toutes les playlists." });
    }
}



export async function getPlaylistById(req: Request, res: Response): Promise<void> {
    const { idPlaylist } = req.params;
    if (!idPlaylist || typeof idPlaylist !== "string") {
        res.status(400).json({ message: "L'identifiant de la playlist est invalide." });
        return;
    }
    try {
        const playlist = await prisma.playlist.findUnique({
            where: { idPlaylist },
            include: { songs: true }, // Inclure les chansons associées à la playlist
        })
        if (!playlist) {
            res.status(404).json({ message: "La playlist n'a pas été trouvée." });
            return;
        }
        res.status(200).json(playlist);
    } catch (error) {
        console.error("Erreur dans getPlaylistId", error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération de la playlist." });
    }
}