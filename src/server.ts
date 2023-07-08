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
