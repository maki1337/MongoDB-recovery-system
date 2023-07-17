import * as express from "express";
import { exec } from "child_process";
import path from "path";
import { getBackendDirPath } from "../Utils/BackupUtils";

const router: express.Router = express.Router();
module.exports = router;

// @desc   Saves a snapshot of the database to the folder
// @route  GET /db/snapshot
router.get("/db/snapshot", async (req: any, resp: express.Response) => {
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

    resp.status(200).send("Snapshot created successfully.");
  } catch (error) {
    console.error("An error occurred while creating the snapshot:", error);
    resp.status(500).send("Failed to create snapshot.");
  }
});

// @desc   Saves a snapshot of the database to the folder
// @route  GET /db/restore
// @param dateString, timeString
router.post("/db/restore", async (req: any, resp: express.Response) => {
  const dateString = req.body.dateString;
  const timeString = req.body.timeString;
  const backupDir = path.join(
    __dirname,
    "..",
    `backups/${dateString}/${timeString}`
  );
  const restoreCommand = `mongorestore --drop --nsInclude=${process.env.MONGO_DATABASE}.* --uri="mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_SERVER}/${process.env.MONGO_DATABASE}" ${backupDir}/${process.env.MONGO_DATABASE}`;

  try {
    exec(restoreCommand, (error, stdout, stderr) => {
      if (error) {
        console.log(`Error: ${error}`);
        resp.status(500).send("Failed to restore database.");
        return;
      }
      if (stderr) {
        console.log(`Warning: ${stderr}`);
      }

      console.log(
        `stdout: Database has been restored successfully:\n${stdout}`
      );
      resp.status(200).send("Database restored successfully.");
    });
  } catch (error) {
    console.error("An error occurred while restoring the database:", error);
    resp.status(500).send("Failed to restore database.");
  }
});
