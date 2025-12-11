import Config from "../models/Config.js";
import AppError from "../utils/appError.js";
import { sendResponse } from "../utils/sendResponse.js";

export const getConfig = async (req, res) => {
  const config = await Config.findOne();
  if (!config) throw new AppError("Config not found", 404);

  sendResponse(req, res, config);
};

export const setConfig = async (req, res) => {
  const { token, tokenType } = req.body;

  if (!token || !tokenType)
    throw new AppError("Token and tokenType (bot | user) are required", 400);

  if (!["bot", "user"].includes(tokenType))
    throw new AppError('tokenType must be either "bot" or "user"', 400);

  const existing = await Config.findOne();

  const config = await Config.findOneAndUpdate(
    {},
    { token, tokenType },
    { new: true, upsert: true, runValidators: true }
  );

  const statusCode = existing ? 200 : 201;

  sendResponse(req, res, config, statusCode);
};
