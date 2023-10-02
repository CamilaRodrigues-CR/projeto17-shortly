import { Router } from "express";
import { getUsers } from "../controllers/usersControllers.js";
import { authValidate } from "../middlewares/authValidate.js";


const usersRouter = Router();

usersRouter.get('/users/me', authValidate, getUsers);

export default usersRouter;