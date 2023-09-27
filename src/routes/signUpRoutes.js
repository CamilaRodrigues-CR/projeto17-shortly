import { Router } from "express";
import { postSignUp } from "../controllers/signUpControllers.js";


const signUpRouter = Router();

signUpRouter.post('/signup', postSignUp);

export default signUpRouter;