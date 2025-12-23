import { getConfigDb } from "../database/queries.js";
import ClientHandler from "../structures/ClientHandler.js";
import AppError from "../utils/appError.js";
import {
  botType,
  botTypeArray,
  itemType,
  itemTypeArray,
  processType,
} from "./constants.js";
import { getBackupByPath } from "./file.js";

export const checkLogin = async (req, res, next) => {
  isCorrectBotType(req);

  const configs = getConfigDb.all();

  const config = configs.find((c) => c.tokenType === req.query.tokenType);

  if (!config) throw new AppError("You have not set a token yet", 400);

  // if (config.tokenType === botType.NORMAL_BOT && !botClient.isReady())
  //   throw new AppError("Bot not logged in, please re-login", 400);

  // if (config.tokenType === botType.SELF_BOT && !userClient.isReady())
  //   throw new AppError("User bot not logged in, please re-login", 400);

  req.type = config.tokenType;

  ClientHandler.getClient(req);

  next();
};

export const checkItemType = (req, res, next) => {
  if (itemTypeArray.includes(req.body.itemType)) return next();

  throw new AppError(
    `itemType (in body) must be one of the: ${itemTypeArray.join(", ")}`,
    400
  );
};

export const isCorrectBotType = (req) => {
  if (botTypeArray.includes(req.query.tokenType)) return;

  throw new AppError(
    `tokenType (in query params) must be one of the: ${botTypeArray.join(
      ", "
    )}`,
    400
  );
};

export const dmOnly = async (req, res, next) => {
  throwErrIfBot(req);
  next();
};

export const throwErrIfBot = (req) => {
  if (req.type === botType.NORMAL_BOT)
    throw new AppError("No DMs with bot, use user bot", 400);
};

export const isDmOrGroup = (type) =>
  type === itemType.DM || type === itemType.GROUP_DM;

export const isGuild = (type) => type === itemType.GUILD;

// for backup, gets the server, dm , group, for restore gets the backup file
export const verifyAndGetItemDetails = (req, type) => {
  const {
    params: { itemId },
    body: { itemType: typeOfItem, itemName },
  } = req;

  const data = { req, itemId, typeOfItem, typeOfProcess: type };

  if (!itemName)
    throw new AppError(
      "Please supply itemName (group, dm, server name) in body",
      400
    );

  if (data.typeOfProcess === processType.BACKUP)
    return verifyBackupProcess(data);

  if (data.typeOfProcess === processType.RESTORE)
    return verifyRestoreProcess(data);
};

const verifyBackupProcess = ({ req, itemId, typeOfItem }) => {
  let item;
  if (isGuild(typeOfItem)) {
    item = ClientHandler.getClient(req).guilds.cache.get(itemId);

    if (!item) throw new AppError(`${typeOfItem} not found`, 404);
  }

  if (isDmOrGroup(typeOfItem)) {
    throwErrIfBot(req);

    item = ClientHandler.getClient(req).channels.cache.get(itemId);

    if (!item || !(item.type === "DM" || item.type === "GROUP_DM"))
      throw new AppError(`${typeOfItem} not found`, 404);
  }

  return item;
};

const verifyRestoreProcess = ({ itemId, typeOfItem }) => {
  const backupData = getBackupByPath(`${typeOfItem}-${itemId}`);

  if (!backupData) throw new AppError("Backup file not found", 404);

  return JSON.parse(backupData);
};
