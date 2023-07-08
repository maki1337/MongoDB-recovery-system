import cron from "node-cron";
import { exec } from "child_process";
import { getBackendDirPath } from "../Utils/BackupUtils";
import { sendMail } from "../core/mail_sender/mail.sender";

async function prepareBackup(): Promise<void> {
  if (process.env.RECOVERY_JOB?.toLowerCase() !== "true") {
    console.log("recovery job is disabled!");
    return;
  }
  console.log("Info: preparing a backup for the database");
  const backupDir = getBackendDirPath();
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

    if (process.env.RECOVERY_JOB?.toLowerCase() !== "true") {
      const msg = `Naredili smo varnostno kopijo podatkovne baze.`;
      sendMail(["matevz.mak@gmail.com"], msg);
    }
  } catch (error) {
    console.error("An error occurred while creating the snapshot:", error);
  }
}

cron.schedule(`${process.env.BACKUP_TIMER}`, prepareBackup);
//cron.schedule("* * * * *", prepareBackup);
