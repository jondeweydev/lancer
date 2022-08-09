require("dotenv").config();

// node modules
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");

// db async helper function
const connectDB = require("./config/db");
connectDB();

// route handlers
const userRouter = require("./routes/userRouter");
const loginRouter = require("./routes/loginRouter");
const listingRouter = require("./routes/listingRouter");

// express
const PORT = process.env.PORT || 3000;
const secretKey = process.env.SESSION_SECRET;
const app = express();

// json parser
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// handle requests for static files
app.use("/assets", express.static("../../build"));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    key: "userID",
    secret: secretKey,
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      maxAge: parseInt(process.env.SESSION_MAX_AGE),
    },
  })
);

// define route handlers
app.use("/api/users", userRouter);
app.use("/api/listings", listingRouter);
app.use("/auth", loginRouter);

// home
app.get("/", (req, res) => {
  return res.sendFile(path.resolve(__dirname, "../../public/index.html"));
});

// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Global error handler caught unknown middleware error",
    status: 400,
    message: { err: "An error occurred" },
  };

  // sets to default err obj unless an err param is defined
  const errorObj = Object.assign({}, defaultErr, err);
  console.log("received error: ", err);

  const { status, message } = errorObj;
  return res.status(status).json({ message });
});

app.listen(PORT, () => {
  console.log("Server started on PORT " + PORT);
});

module.exports = app;
