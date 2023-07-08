require("dotenv").config();
import { connect } from "mongoose";

console.log(
  `mongodb+srv://${escape(process.env.MONGO_USER ?? "")}:${escape(
    process.env.MONGO_PASSWORD ?? ""
  )}@${process.env.MONGO_SERVER}/${
    process.env.MONGO_DATABASE
  }?retryWrites=true&ssl=false`
);

const mongoUri = `mongodb+srv://${escape(
  process.env.MONGO_USER ?? ""
)}:${escape(process.env.MONGO_PASSWORD ?? "")}@${process.env.MONGO_SERVER}/${
  process.env.MONGO_DATABASE
}?retryWrites=true`;

async function run() {
  await connect(mongoUri).catch((e) => {
    console.error("Cannot connect to mongodb!");
    process.exit(1);
  });
}

run()
  .then((succ) => {
    console.log("Successfully connected to mongo! [MONGOOSE SETUP]");
  })
  .catch((err) => {
    console.log("Error connecting to mongodb:", err);
  });
