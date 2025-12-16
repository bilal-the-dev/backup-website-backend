import ProcessController from "../structures/ProcessController.js";
import { sendResponse } from "../utils/sendResponse.js";

export const getMe = (req, res) => {
  const { user } = req.client;

  const data = {
    id: user.id,
    username: user.username,
    globalName: user.globalName,
    bot: user.bot,
    avatarURL: user.avatarURL(),
    defaultAvatarURL: user.defaultAvatarURL,
    processes: ProcessController.getAllProcesses().length,
  };

  sendResponse(req, res, data);
};
