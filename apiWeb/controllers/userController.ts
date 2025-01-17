import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";


export async function login(req: Request, res: Response): Promise<void> {
    try {
        const { username, password } = req.body;

        const user = await prisma.user.findFirst({
            where: { pseudo: username },
        });

        console.log("User", user);

        if (!user) {
            res.status(401).json({ message: "Utilisateur non trouvé" });
            return;
        }

        const isPasswordOk = await bcrypt.compare(password, user.mdp);

        if (!isPasswordOk) {
            res.status(401).json({ message: "Mot de passe incorrect" });
            return;
        }

        const token = jwt.sign(
            { id: user.id, username: user.pseudo },
            JWT_SECRET,
            { expiresIn: "10h" }
        );

        res.status(200).json({
            message: "Connexion réussie.",
            user: { id: user.id, username: user.pseudo },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la connexion." });
    }
}


export async function register(req: Request, res: Response): Promise<void> {
    try {
        const { username, password } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { pseudo: username },
        });

        if (existingUser) {
            res.status(409).json({ message: "Utilisateur déjà existant." });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { pseudo: username, mdp: hashedPassword },
        });

        const token = jwt.sign({ id: user.id, email: user.pseudo }, JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(201).json({
            message: "Utilisateur enregistré avec succès.",
            user: { id: user.id, email: user.pseudo },
            token,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de l'inscription." });
    }
}


export async function getMe(req: Request, res: Response): Promise<void> {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            res.status(403).json({ message: "Token manquant." });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        res.status(200).json({ message: "Authenticated", user: decoded });
    } catch (error) {
        res.status(403).json({ message: "Token invalide." });
    }
}



export async function updateUserData(req: Request, res: Response): Promise<void> {
    try {
        const { userId } = req.params;
        const { username, newPassword } = req.body;

        if (!userId) {
            res.status(400).json({ message: "Id de l'utilisateur manquant." });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            res.status(404).json({ message: "Utilisateur non trouvé." });
            return;
        }

        const updateData: { username?: string, newPassword?: string } = {};

        if (username) {
            const existingUser = await prisma.user.findUnique({
                where: { pseudo: username }
            })

            if (existingUser && existingUser.id !== userId) {
                res.status(409).json({ message: "Utilisateur déjà existant." });
                return;
            }

            updateData.username = username;
        }

        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updateData.newPassword = hashedPassword;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        })

        res.status(200).json({
            message: "Utilisateur mis à jour avec succès.",
            user: {
                id: updatedUser.id,
                username: updatedUser.pseudo,
                updatedAt: updatedUser.createdAt
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la mise à jour des données utilisateur." });
    }
}