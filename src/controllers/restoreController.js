import { DataResolver, Util } from "discord.js-selfbot-v13";
import ClientHandler from "../structures/ClientHandler.js";
import { getAvatar, getBackupByPath } from "../utils/file.js";
import { sendResponse } from "../utils/sendResponse.js";
import AppError from "../utils/appError.js";

export const restoreClientSettings = async (req, res) => {
  const settings = await getBackupByPath("clientSettings");

  if (!settings)
    throw new AppError("No setting backup found, backup first", 400);

  const client = ClientHandler.getClient(req);

  const parsedSettings = JSON.parse(settings);

  const editData = {};

  if (parsedSettings.avatarURL) {
    const avatar = getAvatar(parsedSettings.id, parsedSettings.avatarExt);
    editData.avatar = await DataResolver.resolveImage(avatar);
  }

  if (parsedSettings.bannerURL) {
    const banner = getAvatar(
      `${parsedSettings.id}-banner`,
      parsedSettings.bannerExt
    );

    editData.banner = await DataResolver.resolveImage(banner);
  }

  if (parsedSettings.bio) editData.bio = parsedSettings.bio;

  if (parsedSettings.globalName)
    editData.global_name = parsedSettings.globalName;

  if (parsedSettings.bannerColor) {
    const accent_color = Util.resolveColor(parsedSettings.bannerColor);
    editData.accent_color = accent_color;
  }

  if (parsedSettings.pronouns) editData.pronouns = parsedSettings.pronouns;

  // if (Object.keys(editData).length) await client.user.edit(editData);

  //   if (parsedSettings.globalName)
  //     await client.user.setGlobalName(parsedSettings.globalName);

  if (parsedSettings.avatarURL)
    await client.user.setAvatar(
      getAvatar(parsedSettings.id, parsedSettings.avatarExt)
    );

  //   if (parsedSettings.bannerURL)
  //     await client.user.setBanner(
  //       getAvatar(`${parsedSettings.id}-banner`, parsedSettings.bannerExt)
  //     );

  if (parsedSettings.presenceActivites?.length)
    await client.user.setPresence({
      activities: parsedSettings.presenceActivites,
    });

  sendResponse(req, res, undefined);
};
