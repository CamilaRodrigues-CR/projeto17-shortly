import { Router } from "express";
import { deleteUrl, getRedirectUrl, getUrlById, postUrl } from "../controllers/urlsControllers.js";

const urlsRouter = Router();

urlsRouter.post('/urls/shorten' , postUrl);
urlsRouter.get('/urls/:id' , getUrlById);
urlsRouter.get('/urls/open/:shortUrl' , getRedirectUrl);
urlsRouter.delete('/urls/:id', deleteUrl);

export default urlsRouter;