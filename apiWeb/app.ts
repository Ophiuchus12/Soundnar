import express from "express";
import cors from "cors";
import musicRoutes from "./routes/music";
import userRoutes from "./routes/user";

const app = express();
const PORT = 3000;

// Activer CORS pour toutes les origines (si vous souhaitez autoriser tous les domaines)
app.use(cors());

// Vous pouvez également configurer CORS pour autoriser uniquement votre frontend
// Exemple : app.use(cors({ origin: 'http://localhost:3001' }));

app.use(express.json());

app.use("/api/music", musicRoutes);
app.use("/api/user", userRoutes);



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});