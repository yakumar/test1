const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
require('dotenv').config()

const saltRounds = 10;

const app = express();
const register = require('./controllers/register')
const signin = require('./controllers/signin')

const imageUrl = require('./controllers/imageUrl')

let conString = new Pool({
  user: "vlfveqiu",
  host: "john.db.elephantsql.com",
  database: "vlfveqiu",
  password: "4rLkQCWRl8WnkojfEX6PQm-dTT9yx69_",
  port: 5432
});

// CREATE TABLE users(id int,name VARCHAR(150), email VARCHAR(40),password VARCHAR(24),entries int,joined date);

let db = {
  users: [
    {
      id: "123",
      name: "john",
      email: "hola@gmail.com",
      password: "cookie",
      entries: 0,
      joined: new Date()
    },
    {
      id: "12344",
      name: "sola",
      email: "sola@gmail.com",
      password: "cookie12",
      entries: 0,
      joined: new Date()
    },
    {
      id: "1234",
      name: "HiRA",
      email: "hira@gmail.com",
      password: "hira",
      entries: 0,
      joined: new Date()
    },
    {
      id: "1234",
      name: "Pora",
      email: "pora@gmail.com",
      password: "zxc123",
      entries: 0,
      joined: new Date()
    }
  ]
};
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.listen(8080, () => {
  console.log("Server INITIATED !!");
});

app.get("/", (req, res) => {
  conString.query("SELECT * from users", function(err, result) {
    if (err) {
      return console.error("error running query", err);
    }
    // console.log("Direcct query", result.rows);
    res.json(result.rows);
    // >> output: 2018-08-23T14:02:57.117Z
  });
});
app.post("/form", (req, res) => {
  //console.log(req.body);
  let myAge = req.body.age;
  let myName = req.body.name;
  const query = {
    text: "INSERT INTO users(name, age) VALUES($1, $2)",
    values: [req.body.name, req.body.age]
  };

  conString.query(query, (err, res) => {
    if (err) {
      return console.error("error running query", err);
    }

    console.log(res);
  });
});

// SIGN IN ......

app.post("/signin", (req, res)=>signin.handleSignin(req, res, conString, bcrypt));

app.post("/register", (req, res)=>register.handleRegister(req, res, bcrypt, conString, saltRounds));

app.post("/imageUrl", (req, res)=>imageUrl.handleImage(req, res))

app.get("/profile/:id", (req, res) => {
  //console.log("Body IDDD ::: ", req.params.id);
  const query = {
    text: "SELECT * FROM users WHERE id=$1",
    values: [`${req.params.id}`]
  };

  conString.query(query, (err, result) => {
    if (err) {
      return res.status(404).json("cant enquire the query");
    }
    //console.log(result.rows);
    res.json(result.rows[0]);
  });
});

app.put("/image", (req, res) => {
  //console.log("request BODY::", req.body);

  //UPDATE users SET entries=12 WHERE id=1234;

  let query = {
    text: "UPDATE users SET entries=entries+1 WHERE id=$1 returning *",
    values: [`${req.body.id}`]
  };
  conString.query(query, (err, result) => {
    if (err) {
      return res.status(404).json("cant enquire the query");
    }
    //console.log(result.rows[0]);
    // result.rows[0].entries ++;
    res.json(result.rows[0]);
  });
});

///////

//console.log(process.env)

