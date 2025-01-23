import express from "express";
import { playlistCreation } from "../controllers/playlistController"

const router = express.Router();

router.post('/create', playlistCreation)

export default router;