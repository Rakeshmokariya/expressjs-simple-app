const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const express = require("express");
const db = require("./requires/queries");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.get("/users", db.getUsers);
app.get("/users/:id", db.getUserById);
app.post("/users", db.createUser);
app.put("/users/:id", db.updateUser);


app.listen(port, "0.0.0.0", () => {
  console.log("runnign on port 3000");
});
