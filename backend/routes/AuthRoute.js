import express from "express";
import {
    login,
    logOut,
    me
} from "../controllers/Auth.js";

const router = express.Router();

router.post('/login', login);
router.delete('/logout', logOut);
router.get('/me', me);

export default router;