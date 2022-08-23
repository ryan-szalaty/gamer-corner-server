const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const { urlencoded } = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();

const server = express();

server.use(express.static(path.resolve(__dirname, "../client/build")));
server.use(
  cors({
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  })
);
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.json());

const db = mysql.createConnection({
  host: process.env.PROD_DATABASE_HOST,
  user: process.env.PROD_DATABASE_USER,
  database: process.env.PROD_DATABASE,
  password: process.env.PROD_DATABASE_PASS,
});

db.connect((err) => {
  if (err) throw err;
  else {
    console.log("Database connected!");
  }
});

server.get("/", (req, res) => {
  res.send("Database running successfully.");
});

server.get("/create_table", (req, res) => {
  let sql =
    "CREATE TABLE Users (UserId INT AUTO_INCREMENT, Username VARCHAR(255), Email VARCHAR(255), Password VARCHAR(255), PRIMARY KEY (UserId))";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.send("Created table:", result);
    }
  });
});

server.get("/get_data", (req, res) => {
  let sql = "SELECT * FROM Users";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.send(result);
    }
  });
});

server.post("/register", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  let sql = "INSERT INTO Users (username, email, password) VALUES (?, ?, ?)";
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    db.query(sql, [username, email, hashedPassword], (err, result) => {
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
});

server.listen(process.env.PORT, () => {
  console.log(`Server listening on ${process.env.PORT}`);
});
