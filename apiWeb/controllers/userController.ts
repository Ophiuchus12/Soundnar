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
            where: { username: username },
        });

        //console.log("User", user);

        if (!user) {
            res.status(401).json({ message: "Utilisateur non trouvé" });
            return;
        }

        const isPasswordOk = await bcrypt.compare(password, user.mdp);

        if (!isPasswordOk) {
            res.status(401).json({ message: "Mot de passe incorrect" });
            return;
        }

        // Générer un jeton JWT pour l'utilisateur authentifié
        const token = jwt.sign(
            { id: user.idUser, username: user.username }, // Charge utile du jeton (données encodées)
            JWT_SECRET, // Clé secrète utilisée pour signer le jeton
            { expiresIn: "10h" } // Durée de validité du jeton
        );

        // Répondre avec un statut 200 (OK) et inclure les informations de l'utilisateur et le jeton dans la réponse
        res.status(200).json({
            message: "Connexion réussie.", // Message de confirmation
            user: { id: user.idUser, username: user.username }, // Informations publiques sur l'utilisateur
            token, // Jeton JWT pour authentification future
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
            where: { username: username },
        });

        if (existingUser) {
            res.status(409).json({ error: "USERNAME_TAKEN", message: "Utilisateur déjà existant." });
            return;
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { username: username, mdp: hashedPassword },
        });

        const token = jwt.sign({ id: user.idUser, email: user.username }, JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(201).json({
            message: "Utilisateur enregistré avec succès.",
            user: { id: user.idUser, email: user.username },
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
            where: { idUser: userId },
        });

        if (!user) {
            res.status(404).json({ message: "Utilisateur non trouvé." });
            return;
        }

        const updateData: { username?: string, newPassword?: string } = {};

        if (username) {
            const existingUser = await prisma.user.findUnique({
                where: { username: username }
            })

            if (existingUser && existingUser.idUser !== userId) {
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
            where: { idUser: userId },
            data: updateData,
        })

        res.status(200).json({
            message: "Utilisateur mis à jour avec succès.",
            user: {
                idUser: updatedUser.idUser,
                username: updatedUser.username,
                updatedAt: updatedUser.createdAt
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la mise à jour des données utilisateur." });
    }
}