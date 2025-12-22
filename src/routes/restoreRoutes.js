import express from "express";
import { dmOnly } from "../utils/checkers.js";
import { restoreClientSettings } from "../controllers/restoreController.js";

const restoreRouter = express.Router();

restoreRouter.post("/client-settings", dmOnly, restoreClientSettings);

export default restoreRouter;
