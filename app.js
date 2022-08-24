const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const { urlencoded } = require("express");
require("dotenv").config();
const app = express();

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.set("view engine", "ejs");

app.use(
    cors({
      origin: true,
      methods: ["GET", "POST"],
      credentials: true,
    })
  );
  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index");
})

app.listen(port, () => {
    console.log(`Server listening on PORT ${port}!`);
});