import { Router } from "express";
import { getUsers } from "../controllers/usersControllers.js";


const usersRouter = Router();

usersRouter.get('/users/me', getUsers);

export default usersRouter;