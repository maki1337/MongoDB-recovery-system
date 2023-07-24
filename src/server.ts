import express from "express";
const app = express();
const port = 3000;
const db = require("./database/databaseConnection");
import fs from "fs";
import path from "path";
const absPath = path.resolve(__dirname, ".");
import bodyParser from "body-parser";
const directoryPath = path.join(process.cwd(), "backups");
const backupJob = require("./jobs/backup.job");

if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath, { recursive: true });
  console.log("Directory 'backups' created.");
} else {
  console.log("Directory 'backups' already exists.");
}

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

if (!process.env.PORT) {
  console.log("Port not specified!");
  process.exit(1);
}
if (!process.env.MONGO_SERVER) {
  console.log("Mongodb server not specified!");
  process.exit(1);
}
if (!process.env.MONGO_USER) {
  console.log("Mongodb user not specified!");
  process.exit(1);
}
if (!process.env.MONGO_PASSWORD) {
  console.log("Mongodb password not specified!");
  process.exit(1);
}
if (!process.env.SMTP_EMAIL) {
  console.log("SMTP email not specified!");
  process.exit(1);
}
if (!process.env.SMTP_EMAIL_PASSWORD) {
  console.log("SMTP email password not specified!");
  process.exit(1);
}
if (!process.env.SMTP_SERVER) {
  console.log("SMTP server not specified!");
  process.exit(1);
}
if (!process.env.SMTP_PORT) {
  console.log("SMTP server port not specified!");
  process.exit(1);
}
if (!process.env.MONGO_DATABASE) {
  console.log("Mongo database not specified!");
  process.exit(1);
}

if (!process.env.RECOVERY_JOB) {
  console.log("Recovery job not specified!");
  process.exit(1);
}

if (!process.env.BACKUP_TIMER) {
  console.log("Backup timer not specified!");
  process.exit(1);
}

if (!process.env.RECOVERY_JOB_MAIL_SENDER) {
  console.log("Recovery job mail sender not specified!");
  process.exit(1);
}

if (!process.env.AUTO_CLEANER) {
  console.log("Auto cleaner not specified!");
  process.exit(1);
}

fs.readdir(
  absPath + "/routes/",
  async (err: NodeJS.ErrnoException | null, files: string[]) => {
    if (err) {
      console.log("Error processing routes!", err);
      process.exit(1);
    }
    files.forEach((routeFileName: string) => {
      console.log("Importing " + routeFileName + "...");
      app.use(require(absPath + "/routes/" + routeFileName));
    });
    app.use((req: express.Request, res: express.Response, next: any) => {
      const error = new Error("Not found");
      next(error);
    });
    app.use(
      (error: any, req: express.Request, res: express.Response, next: any) => {
        res.status(error.status || 500);
        res.json({ message: error.message });
      }
    );
  }
);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
