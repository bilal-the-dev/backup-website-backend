import express from "express";
import { getConfig, setConfig } from "../controllers/configController.js";

const configRouter = express.Router();

configRouter.get("/", getConfig);
configRouter.post("/", setConfig);

export default configRouter;
