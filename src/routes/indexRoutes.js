import { Router } from "express";
import signInRouter from "./signInRoutes.js";
import signUpRouter from "./signUpRoutes.js";
import urlsRouter from "./urlsRoutes.js";
import usersRouter from "./usersRoutes.js";
import rankingRouter from "./rankingRoutes.js";

const router = Router();

router.use(signInRouter);
router.use(signUpRouter);
router.use(urlsRouter);
router.use(usersRouter);
router.use(rankingRouter);

export default router;