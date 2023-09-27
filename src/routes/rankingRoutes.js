import { Router } from "express";
import { getRanking } from "../controllers/rankingControllers.js";


const rankingRouter = Router();

rankingRouter.get('/ranking', getRanking);

export default rankingRouter;