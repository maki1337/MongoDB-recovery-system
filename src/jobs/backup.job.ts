import cron from "node-cron";
import { exec } from "child_process";
import { getBackendDirPath } from "../Utils/BackupUtils";
import { sendMail } from "../core/mail_sender/mail.sender";
import * as fs from "fs";
import * as path from "path";
import { endOfMonth, isSameDay, format, subMonths } from "date-fns";

async function prepareBackup(): Promise<void> {
  if (process.env.RECOVERY_JOB?.toLowerCase() !== "true") {
    console.log("recovery job is disabled!");
    return;
  }
  console.log("Info: preparing a backup for the database");
  const backupDir = getBackendDirPath();
  const dumpCommand = `mongodump --uri="mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_SERVER}/${process.env.MONGO_DATABASE}" --out ${backupDir}`;

  if (
    !isSameDay(new Date(), endOfMonth(new Date())) &&
    process.env.AUTO_CLEANER?.toLowerCase() !== "false"
  ) {
    // check if today is end of the month
    console.log(
      "Info: End of the month detected. Initiating backup cleanup for last month."
    );

    const backupFolderPath = path.resolve(__dirname, "../backups");
    const lastMonth = format(subMonths(new Date(), 1), "M-yyyy");

    fs.readdir(backupFolderPath, (err, folders) => {
      if (err) {
        console.error(
          "An error occurred while reading the backup directory:",
          err
        );
        return;
      }

      folders.forEach((folder) => {
        if (folder.includes(lastMonth)) {
          fs.rmdir(
            path.join(backupFolderPath, folder),
            { recursive: true },
            (err) => {
              if (err) {
                console.error(
                  `An error occurred while deleting the folder ${folder}:`,
                  err
                );
              } else {
                console.log(`Successfully deleted the folder: ${folder}`);
              }
            }
          );
        }
      });
    });
  }

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
