"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChart = getChart;
const musicServices_1 = require("../services/musicServices");
function getChart(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const chartData = yield (0, musicServices_1.fetchChart)();
            if (!chartData) {
                res.status(404).json({ message: "Chart not found" });
                return;
            }
            res.status(200).json(chartData);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erreur lors de la récuếration des données chart" });
        }
    });
}
