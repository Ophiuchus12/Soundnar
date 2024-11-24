import { Request, Response } from "express";
import { fetchChart } from "../services/musicServices";

export async function getChart(req: Request, res: Response): Promise<void> {
    try {
        const chartData = await fetchChart();
        if (!chartData) {
            res.status(404).json({ message: "Chart not found" });
            return;
        }
        res.status(200).json(chartData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la récuếration des données chart" });


    }
}