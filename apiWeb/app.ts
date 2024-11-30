import express from "express";
import cors from "cors";
import musicRoutes from "./routes/music";

const app = express();
const PORT = 3000;

// Activer CORS pour toutes les origines (si vous souhaitez autoriser tous les domaines)
app.use(cors());

// Vous pouvez également configurer CORS pour autoriser uniquement votre frontend
// Exemple : app.use(cors({ origin: 'http://localhost:3001' }));

app.use(express.json());

app.use("/api/music", musicRoutes);



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});