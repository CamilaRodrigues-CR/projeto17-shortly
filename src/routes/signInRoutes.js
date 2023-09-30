import { Router } from "express";
import { postSignIn } from "../controllers/signInControllers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { signInSchema } from "../schemas/validateSignIn.js";

const signInRouter = Router();

signInRouter.post('/signin',validateSchema(signInSchema), postSignIn);

export default signInRouter;