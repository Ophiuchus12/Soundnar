import express from "express";
import { login, register, getMe, updateUserData } from "../controllers/userController";
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", getMe);
// à voir après pour mieux l'utiliser dans les routes et pas forcemetnn exister au depart en tant que focntion appelable
router.post("/verify", authenticateJWT);
router.put('/update/:userId', updateUserData);


export default router;