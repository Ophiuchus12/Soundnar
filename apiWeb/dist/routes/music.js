"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const musicController_1 = require("../controllers/musicController");
const router = express_1.default.Router();
// getchart info
router.get("/chart", musicController_1.getChart);
exports.default = router;
