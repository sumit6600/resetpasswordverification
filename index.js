const express = require("express");
const connection = require("./db");
const cors = require("cors");
//const route = require("./Routes/indexroute");
require("dotenv").config();
const app = express();

(async function db() {
  await connection();
})();

app.use(cors());
app.use(express.json());
//app.use("/api/", route);
app.use("/api", require("./Routes/indexroute"));
app.use((error, req, res, next) => {
  res.status(500).json({ error: error.message });
});
const PORT = 5000;
app.get("/hello", (req, res) => {
  res.send("hello");
});

app.listen(PORT, console.log(`server is running in port ${PORT}`));
