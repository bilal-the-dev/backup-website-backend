import express from "express";
import { dmOnly, checkItemType } from "../utils/checkers.js";
import {
  restoreClientSettings,
  restoreItem,
} from "../controllers/restoreController.js";

const restoreRouter = express.Router();

restoreRouter.post("/client-settings", dmOnly, restoreClientSettings);
restoreRouter.post("/:itemId", checkItemType, restoreItem);

export default restoreRouter;
