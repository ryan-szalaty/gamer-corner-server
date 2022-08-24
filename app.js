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

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASS,
});

db.connect((err) => {
  if (err) throw err;
  else {
    console.log("Database connected!");
  }
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/create_table", (req, res) => {
  let sql =
    "CREATE TABLE Users (UserId INT AUTO_INCREMENT, Username VARCHAR(255), Email VARCHAR(255), Password VARCHAR(255), PRIMARY KEY (UserId))";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.send("Created table.");
    }
  });
});

app.get("/get_data", (req, res) => {
  let sql = "SELECT * FROM Users";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.send(result);
    }
  });
});

app.post("/register", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  let sql = "INSERT INTO Users (username, email, password) VALUES (?, ?, ?)";
  db.query(sql, [username, email, password], (err, result) => {
    if (err) throw err;
    else {
      console.log("Successfully registered. New user: ", {
        name: username,
        mail: email,
        pass: hashedPassword,
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on PORT ${port}!`);
});
