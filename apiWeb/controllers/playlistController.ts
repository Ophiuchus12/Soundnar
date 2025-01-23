import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";



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