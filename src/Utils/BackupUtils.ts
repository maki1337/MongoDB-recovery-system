import path from "path";

export function getBackendDirPath(): string {
  const date = new Date();
  const dateString = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;
  const timeString = `${date.getHours()}-${date.getMinutes()}`;
  const backupDir = path.join(
    __dirname,
    "..",
    `backups/${dateString}/${timeString}`
  );

  return backupDir;
}
