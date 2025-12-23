export const botType = { SELF_BOT: "user", NORMAL_BOT: "bot" };
export const botTypeArray = [botType.SELF_BOT, botType.NORMAL_BOT];

export const itemType = { GUILD: "guild", DM: "dm", GROUP_DM: "groupdm" };
export const itemTypeArray = [itemType.GUILD, itemType.DM, itemType.GROUP_DM];

export const ChannelTypes = {
  GUILD_TEXT: 0,
  DM: 1,
  GUILD_VOICE: 2,
  GROUP_DM: 3,
  GUILD_CATEGORY: 4,
  GUILD_NEWS: 5,
  GUILD_STORE: 6,
  UNKNOWN: 7,
  GUILD_NEWS_THREAD: 10,
  GUILD_PUBLIC_THREAD: 11,
  GUILD_PRIVATE_THREAD: 12,
  GUILD_STAGE_VOICE: 13,
  GUILD_DIRECTORY: 14,
  GUILD_FORUM: 15,
  GUILD_MEDIA: 16,
};
export const processStatus = {
  Active: "active",
  Completed: "completed",
  Errored: "errored",
};

export const processType = { BACKUP: "backup", RESTORE: "restore" };
