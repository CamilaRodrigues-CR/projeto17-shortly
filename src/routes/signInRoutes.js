import { Router } from "express";
import { postSignIn } from "../controllers/signInControllers.js";

const signInRouter = Router();

signInRouter.post('/signin', postSignIn);

export default signInRouter;