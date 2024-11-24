import express from "express";
import { getChart } from "../controllers/musicController";

const router = express.Router();

// getchart info

router.get("/chart", getChart);


export default router;