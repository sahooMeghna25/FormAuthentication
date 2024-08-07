const express = require("express");
const app = express();
const path = require("path");
const crypt = require("bcrypt");
const collection = require("./config");
const { name } = require("ejs");
const port = 8080;
//for css
app.use("/assets", express.static("assets"));
console.log(__dirname);
const res = path.join(__dirname, "..", "public");
console.log("res***", { res });
const viewpath = path.join(__dirname, "..", "view", "login");

//use ejs as view engine
app.set("view engine", "ejs");
//convert data into json format
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.render(`${viewpath}`);
});

app.get("/signup", (req, res) => {
  res.render(path.join(__dirname, "..", "view", "signup"));
});

//Register User

app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password,
  };
  //Check if user already exit or not
  const existingUser = await collection.findOne({ name: data.name });
  if (existingUser) {
    res.send("User already exist,please choose another user");
  } else {
    //hash the password using bcrypt
    const saltRound = 10;
    const hashPassword = await crypt.hash(data.password, saltRound);
    console.log(hashPassword);
    data.password = hashPassword; //Replace the hash password with original password
    const userdata = await collection.insertMany(data);
    res.send("Successfully Signed Up");
    console.log(userdata);
  }
});

//login user

app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ name: req.body.username });
    if (!check) {
      res.send("user name cannot found");
    }

    //compare the hash password to database
    const isPasswordMatch = await crypt.compare(
      req.body.password,
      check.password
    );
    if (isPasswordMatch) {
      res.render(path.join(__dirname, "..", "view", "home"));
    } else {
      res.send("wrong password");
    }
  } catch {
    res.send("wrong details");
  }
});

app.listen(port, () => {
  console.log(`Server running on this port: ${port}`);
});
