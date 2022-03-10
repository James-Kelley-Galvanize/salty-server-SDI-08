require("dotenv").config();

const express = require("express");
const morgan = require("morgan");

const { hash, compare } = require("bcrypt");
const saltRounds = 12;
const { createUser, getPasswordHashForUser } = require("./controllers");

const app = express();

// middleware
app.use(express.json());
app.use(morgan("tiny"));

// create a user
app.post("/register", (req, res) => {
  // hash password and store
  let { username, password } = req.body;

  if (!username) res.status(401).send("username required for signup");
  else if (!password) res.status(401).send("password require for signup");
  else {
    hash(password, saltRounds).then((hashedPassword) => {
      console.log(`user's real password:`, password);
      console.log(`That password hashed to:`, hashedPassword);
      createUser(username, hashedPassword)
        .then((data) => res.status(201).json("USER CREATED SUCCESSFULLY"))
        .catch((err) => res.status(500).json(err));
    });
  }
});

// login as a user - validates user credentials
app.post("/login", (req, res) => {
  // compare password to hashed password
  let { username, password } = req.body;

  if (!username) res.status(401).send("username required for login");
  else if (!password) res.status(401).send("password require for login");
  else {
    getPasswordHashForUser(username)
      .then((hashedPassword) => {
        console.log(`user's entered password:`, password);
        console.log(`That user's hashed password:`, hashedPassword);

        compare(password, hashedPassword)
          .then((isMatch) => {
            if (isMatch) res.status(202).json("passwords match");
            // THIS IS THE SUCCESSFUL LOGIN RESPONSE
            else
              res.status(401).json("incorrect username or password supplied");
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
});

module.exports = app;
