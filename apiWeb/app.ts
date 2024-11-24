import express from "express";
import musicRoutes from "./routes/music";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/api/music", musicRoutes);



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});