import { Router } from "express";
import { postSignUp } from "../controllers/signUpControllers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { userSchema } from "../schemas/validateUser.js";


const signUpRouter = Router();

signUpRouter.post('/signup',validateSchema(userSchema), postSignUp);

export default signUpRouter;