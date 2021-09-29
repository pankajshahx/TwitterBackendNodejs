const express = require("express");

const mongoose = require("mongoose");
const dotenv = require('dotenv');
const helmet = require('helmet');
const session = require("express-session");
const cookies = require("cookie-parser");

const morgan = require('morgan');
const { v4: uuidv4 } = require("uuid");
const userRoute = require("./routes/users");
const authRoute = require("./routes/authUser");


const app = express();

const maxTime = 1000 * 60 * 60 * 24;

const dbUri = "mongodb+srv://pankajshah:admin123@cluster0.vft7u.mongodb.net/twitter?retryWrites=true&w=majority";

mongoose.connect(dbUri,{useNewUrlParser : true,useUnifiedTopology:true})
    .then((result)=>console.log("connected to db"))
    .catch((err) => console.log(err));



app.get("/",(req,res) => {
    res.send("server loading");
});

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use(
    session({
      secret: uuidv4(),
      resave: false,
      cookie: { maxAge: maxTime },
      saveUninitialized: true,
    })
  );
app.use(cookies());

app.use("/api/users" , userRoute);
app.use("/api/authentication" , authRoute);

app.listen(3000,() => {
    console.log("Listening.");
});