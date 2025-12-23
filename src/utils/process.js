import ProcessController from "../structures/ProcessController.js";
import { backupDm, backupGuild } from "./backup.js";
import { isDmOrGroup, isGuild } from "./checkers.js";
import { processStatus, processType } from "./constants.js";
import { generateUniqueId } from "./crypto.js";
import { saveBackup } from "./file.js";
import { restoreDM, restoreGuild } from "./restore.js";

export const startProcess = async (req, type, item) => {
  const {
    body: { itemType, itemName, iconURL, itemIdToRestoreInto },
    query: { tokenType },
  } = req;

  const processId = generateUniqueId();
  const processData = {
    processType: type,
    processId,
    status: processStatus.Active,
    tokenType,
    itemName,
    itemType,
    iconURL,
  };

  if (type === processType.BACKUP)
    processData.backupId = `${itemType}-${item.id}`;

  ProcessController.setProcess(processId, processData);
  try {
    if (type === processType.BACKUP) {
      let remainingProps = {};

      if (isGuild(itemType)) remainingProps = await backupGuild(item);

      if (isDmOrGroup(itemType)) remainingProps = await backupDm(item);

      const backupData = {
        id: item.id,
        type: item.type || "guild", // since guild dont have type
        name: itemName,
        ...remainingProps,
      };

      await saveBackup(processData.backupId, backupData);
    }

    if (type === processType.RESTORE) {
      if (isGuild(itemType)) await restoreGuild(req, item, itemIdToRestoreInto);

      if (isDmOrGroup(itemType))
        await restoreDM(req, item, itemIdToRestoreInto);
    }

    ProcessController.setProcess(processId, {
      ...processData,
      status: processStatus.Completed,
    });
  } catch (error) {
    console.error(error);

    const process = ProcessController.getProcess(processId);

    if (!process) return;

    ProcessController.setProcess(processId, {
      ...process,
      status: processStatus.Errored,
      errorMsg: error.message,
    });
  }
};
