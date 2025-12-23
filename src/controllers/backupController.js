import ClientHandler from "../structures/ClientHandler.js";
import AppError from "../utils/appError.js";
import { verifyAndGetItemDetails } from "../utils/checkers.js";
import { processType } from "../utils/constants.js";
import {
  downloadAndSaveFile,
  getBackupByPath,
  saveBackup,
} from "../utils/file.js";
import { startProcess } from "../utils/process.js";
import { sendResponse } from "../utils/sendResponse.js";

export const sendBackup = async (req, res) => {
  const backupId = req.params.backupId;

  const backupData = getBackupByPath(backupId);

  if (!backupData) throw new AppError("Backup file not found", 404);

  res.send(backupData);
};

export const backupItem = async (req, res) => {
  const item = verifyAndGetItemDetails(req, processType.BACKUP);

  startProcess(req, processType.BACKUP, item);

  sendResponse(req, res, undefined);
};

export const backupClientSettings = async (req, res) => {
  const client = ClientHandler.getClient(req);

  const user = await client.users.fetch(client.user.id, { force: true });

  const profile = {
    id: user.id,
    username: user.username,
    globalName: user.globalName,
    avatarURL: user.displayAvatarURL(), // returns gif if animated
    presenceActivites: user.presence?.activities,
    bannerColor: user.bannerColor,
    pronouns: user.pronouns,
    bannerURL: user.bannerURL({ dynamic: true }),
    bio: user.bio,
  };

  let avatarExt, bannerExt;

  if (profile.avatarURL)
    avatarExt = await downloadAndSaveFile({
      fileURL: profile.avatarURL,
      id: user.id,
    });

  if (profile.bannerURL)
    bannerExt = await downloadAndSaveFile({
      fileURL: profile.bannerURL,
      id: user.id,
      isBanner: true,
    });

  profile.avatarExt = avatarExt;
  profile.bannerExt = bannerExt;

  await saveBackup("clientSettings", profile);

  sendResponse(req, res, profile);
};

export const backupFriends = async (req, res) => {
  const client = ClientHandler.getClient(req);

  const friends = [...client.relationships.friendCache.values()];

  const friendsBackup = [];

  friends.forEach((friend) => {
    if (!friend) return;

    friendsBackup.push({
      id: friend.id,
      username: friend.username,
      globalName: friend.globalName,
      avatar: friend.displayAvatarURL(),
    });
  });

  await saveBackup("friends", friendsBackup);

  sendResponse(req, res, friendsBackup);
};

export const sendSavedClientSettings = async (req, res) => {
  const settings = getBackupByPath("clientSettings");

  if (!settings)
    throw new AppError("No setting backup found, backup first", 400);

  res.send(settings);
};
