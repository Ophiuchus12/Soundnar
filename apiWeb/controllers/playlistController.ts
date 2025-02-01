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
            res.status(400).json({ message: "Playlist déjà existante." });
            return;
        }

        const playlist = await prisma.playlist.create({
            data: { title: normalizedTitle, authorId },
        });



        res.status(201).json({ message: "Playlist créée avec succès.", playlist });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Une erreur interne est survenue." });
    }
}


export async function addTrack(req: Request, res: Response): Promise<void> {
    const { idPlaylist, idTrack } = req.body;
    //console.log("gggg", typeof idPlaylist, typeof idTrack);
    // Validation des paramètres
    if (!idPlaylist || typeof idPlaylist !== "string") {
        res.status(400).json({ message: "L'identifiant de la playlist est invalide." });
        return;
    }

    if (!idTrack || typeof idTrack !== "string") {
        res.status(400).json({ message: "L'identifiant de la piste est invalide." });
        return;
    }


    //console.log("BEFOREtestpage");
    try {

        //console.log("testpage");
        // Récupération des détails de la piste depuis l'API Deezer
        const responseTrack = await fetchTrack(idTrack);

        //console.log("RESS", responseTrack);

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
                duration: playlist.duration + track.duration,
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
    console.log("gggg", idPlaylist, typeof idTrack);
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

        //console.log("playlistdelete", playlist);

        if (!playlist) {
            res.status(404).json({ message: "La playlist n'a pas été trouvée." });
            return;
        }

        // Vérifier si la chanson est présente dans la playlist
        const track = playlist.songs.find((song) => song.idTrackDeezer === idTrack);

        console.log("track", track);

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
                duration: playlist.duration - track.duration, // Réduire le temps total de la playlist
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

export async function addTrackFavorite(req: Request, res: Response): Promise<void> {
    const { idTrack, userId } = req.body;

    // Validation des entrées
    if (!idTrack || typeof idTrack !== "string") {
        res.status(400).json({ message: "L'identifiant de la piste est invalide." });
        return;
    }

    if (!userId || typeof userId !== "string") {
        res.status(400).json({ message: "L'identifiant de l'utilisateur est invalide ou manquant." });
        return;
    }

    try {
        // Récupérer les détails de la piste depuis l'API Deezer
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

        // Récupérer les favoris de l'utilisateur
        const userFavorites = await prisma.favorites.findUnique({
            where: {
                userId: userId,
            },
            include: {
                tracks: true, // Inclure les pistes existantes dans les favoris
            },
        });

        // Si l'utilisateur n'a pas de liste de favoris, en créer une nouvelle
        if (!userFavorites) {
            await prisma.favorites.create({
                data: {
                    userId: userId,
                    tracks: {
                        connect: {
                            idTrack: track.idTrack, // Ajouter la chanson aux favoris
                        },
                    },
                },
            });
            res.status(201).json({ message: "La chanson a été ajoutée aux favoris.", track });
        } else {
            // Vérifier si la chanson est déjà dans les favoris
            const trackExistsInFavorites = userFavorites.tracks.some(
                (favTrack) => favTrack.idTrackDeezer === track.idTrackDeezer
            );

            if (trackExistsInFavorites) {
                res.status(409).json({ message: "Cette chanson est déjà dans les favoris.", track });
            } else {
                // Ajouter la chanson aux favoris de l'utilisateur
                await prisma.favorites.update({
                    where: {
                        userId: userId,
                    },
                    data: {
                        tracks: {
                            connect: {
                                idTrack: track.idTrack, // Connecter la chanson à l'utilisateur
                            },
                        },
                    },
                });
                res.status(200).json({ message: "La chanson a été ajoutée aux favoris.", track });
            }
        }

    } catch (err) {
        console.error("Erreur dans addTrackFavorite:", err);
        res.status(500).json({ message: "Erreur serveur lors de l'ajout de la chanson aux favoris." });
    }
}

export async function deleteTrackFavorite(req: Request, res: Response): Promise<void> {
    const { idTrack, userId } = req.body;

    // Vérification des entrées
    if (!idTrack || typeof idTrack !== "string") {
        res.status(400).json({ message: "L'identifiant de la piste est invalide." });
        return;
    }

    if (!userId || typeof userId !== "string") {
        res.status(400).json({ message: "L'identifiant de l'utilisateur est invalide ou manquant." });
        return;
    }

    try {
        // Récupérer la liste de favoris de l'utilisateur
        const userFavorites = await prisma.favorites.findUnique({
            where: {
                userId: userId,
            },
            include: {
                tracks: true,
            },
        });

        if (!userFavorites) {
            res.status(404).json({ message: "Aucune liste de favoris trouvée pour cet utilisateur." });
            return;
        }

        // Vérifier si la chanson est dans les favoris
        const trackExistsInFavorites = userFavorites.tracks.find(track => track.idTrackDeezer === idTrack);

        if (!trackExistsInFavorites) {
            res.status(404).json({ message: "Cette chanson n'est pas dans les favoris." });
            return;
        }

        // Supprimer la chanson des favoris
        await prisma.favorites.update({
            where: {
                userId: userId,
            },
            data: {
                tracks: {
                    disconnect: {
                        idTrack: trackExistsInFavorites.idTrack,
                    },
                },
            },
        });

        res.status(200).json({ message: "La chanson a été supprimée des favoris avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression de la chanson des favoris:", error);
        res.status(500).json({ message: "Erreur serveur lors de la suppression de la chanson des favoris." });
    }
}


export async function getFavorites(req: Request, res: Response): Promise<void> {
    const { userId } = req.body;

    // Vérification de l'entrée
    if (!userId || typeof userId !== "string") {
        res.status(400).json({ message: "L'identifiant de l'utilisateur est invalide ou manquant." });
        return;
    }

    try {
        // Récupérer la liste de favoris de l'utilisateur
        const userFavorites = await prisma.favorites.findUnique({
            where: {
                userId,
            },
            include: {
                tracks: true, // Inclure les pistes existantes dans les favoris
            },
        });

        if (!userFavorites || userFavorites.tracks.length === 0) {
            res.status(404).json({ message: "Aucune piste favorite trouvée pour cet utilisateur." });
            return;
        }

        res.status(200).json({ favorites: userFavorites.tracks });
    } catch (error) {
        console.error("Erreur lors de la récupération des favoris:", error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des favoris." });
    }
}
