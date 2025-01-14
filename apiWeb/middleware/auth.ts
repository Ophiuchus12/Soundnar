import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(403).json({ message: "Token manquant." });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Si tout est OK, on passe à la suite avec `next()`
        next();  // Cela passe à la prochaine fonction de traitement

        // Ajouter une réponse pour indiquer que l'authentification est réussie
        res.status(200).json({ message: "Authenticated", user: decoded });
    } catch (error) {
        res.status(403).json({ message: "Token invalide." });
    }
}
