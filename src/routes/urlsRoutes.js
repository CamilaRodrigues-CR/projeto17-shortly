import { Router } from "express";
import { deleteUrl, getRedirectUrl, getUrlById, postUrl } from "../controllers/urlsControllers.js";
import { authValidate } from "../middlewares/authValidate.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { urlsSchema } from "../schemas/validateUrls.js";

const urlsRouter = Router();

urlsRouter.post('/urls/shorten', validateSchema(urlsSchema), authValidate, postUrl);
urlsRouter.get('/urls/:id', getUrlById);
urlsRouter.get('/urls/open/:shortUrl', getRedirectUrl);
urlsRouter.delete('/urls/:id', authValidate, deleteUrl);

export default urlsRouter;