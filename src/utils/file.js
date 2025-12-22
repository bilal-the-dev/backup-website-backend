import fs from "node:fs/promises";
import path from "node:path";
import fsSync from "node:fs";

const __dirname = import.meta.dirname;

const backupPath = path.join(__dirname, "..", "..", "backups");
const avatarPath = path.join(__dirname, "..", "..", "avatars");

const getAttachmentPath = (itemId) =>
  path.join(__dirname, "..", "..", "attachments", itemId);

export const ensureAttachmentsDirectoryExists = (itemId) => {
  const attachmentsDirectory = getAttachmentPath(itemId);

  if (!fsSync.existsSync(attachmentsDirectory)) {
    fsSync.mkdirSync(attachmentsDirectory, { recursive: true });
  }
};

export const saveBackup = async (backupId, backupData) => {
  const backupFilePath = path.join(backupPath, `backup-${backupId}.json`);

  await fs.writeFile(
    backupFilePath,
    JSON.stringify(backupData, null, 2),
    "utf-8"
  );

  console.log(`Backup saved to ${backupFilePath}`);
};

// avatar like includes guild icon, user avatar/banner
export const downloadAndSaveFile = async ({
  id, // attachment id or avatar user id or server id
  itemId, // in case of attachments, the server/dm/group id
  fileURL,
  isAttachment,
  isBanner,
}) => {
  const response = await fetch(fileURL);

  const arrayBuff = await response.arrayBuffer();

  const buffer = Buffer.from(arrayBuff);
  const fileExtension = response.headers.get("content-type").split("/").pop(); // Extract file extension

  const filePath = path.join(
    isAttachment ? getAttachmentPath(itemId) : avatarPath,
    `${id}${isBanner ? "-banner" : ""}.${fileExtension}`
  );

  await fs.writeFile(filePath, buffer);

  return fileExtension;
};

export const getBackupByPath = async (backupId) => {
  const backupFilePath = path.join(backupPath, `backup-${backupId}.json`);

  if (!fsSync.existsSync(backupFilePath)) return;

  return await fs.readFile(backupFilePath, "utf-8");
};

// User id or server id
export const getAvatar = (id, ext) => {
  const filePath = path.join(avatarPath, `${id}.${ext}`);

  if (!fsSync.existsSync(filePath)) return;

  return fsSync.readFileSync(filePath);
};

export const getAllBackups = () => {
  const backups = fsSync
    .readdirSync(backupPath)
    .filter((file) => file.startsWith(`backup-`) && file.endsWith(".json"))
    .map((file) => {
      try {
        const filePath = path.join(backupPath, file);
        const data = JSON.parse(fsSync.readFileSync(filePath, "utf-8"));
        return {
          id: data.id,
          name: data.name,
          iconURL: data.iconURL,
          type: data.type,
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    })
    .filter((data) => data !== null);

  return backups;
};
