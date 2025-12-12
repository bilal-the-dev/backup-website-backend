import { sendResponse } from "../utils/sendResponse.js";

export const getMe = (req, res) => {
  const { user } = req.client;

  const data = {
    id: user.id,
    username: user.username,
    globalName: user.globalName,
    bot: user.bot,
    avatarURL: user.avatarURL,
    defaultAvatarURL: user.defaultAvatarURL,
  };

  sendResponse(req, res, data);
};
