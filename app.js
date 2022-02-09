require("dotenv").config();
const express = require("express");
const router = require("./api/users/user.router");

const app = express();
app.use(express.json());
app.use("/api/users", router);

app.listen(process.env.APP_PORT, () => {
  console.log(`Listening on port ${process.env.APP_PORT}`);
});
