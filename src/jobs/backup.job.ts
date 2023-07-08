import cron from "node-cron";
import { exec } from "child_process";
import path from "path";

async function prepareBackup(): Promise<void> {
  console.log("Info: preparing a backup for the database");
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
  const dumpCommand = `mongodump --uri="mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_SERVER}/${process.env.MONGO_DATABASE}" --out ${backupDir}`;

  try {
    exec(dumpCommand, (error, stdout, stderr) => {
      if (error) {
        console.log(`Error: ${error}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }

      console.log(
        `stdout: Database has been backed up successfully:\n${stdout}`
      );
    });

    console.log("Snapshot created successfully.");
  } catch (error) {
    console.error("An error occurred while creating the snapshot:", error);
  }
}

cron.schedule("0 0 7-16/2 * * *", prepareBackup());
//cron.schedule("* * * * *", prepareBackup);
