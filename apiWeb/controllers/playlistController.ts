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


// model Track {
//     idTrack       String     @id @default(uuid())
//     idTrackDeezer String
//     title         String
//     duration      Int
//     preview       String
//     md5Image      String
//     artistId      String
//     albumId       String
//     playlists     Playlist[]
//   }