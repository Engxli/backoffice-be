const express = require("express");
const config = require("./config");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const { localStrategy, jwtStrategy } = require("./middlewares/passport");
const errorHandler = require("./middlewares/errorHandler");
const notfoundHandler = require("./middlewares/notfoundHandler");
const { initializeDatabase } = require("./database");

// initialize the app
const app = express();

// middlewares before routes
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(passport.initialize());
passport.use("local", localStrategy);
passport.use("jwt", jwtStrategy);

// routes
app.use("/api/auth", require("./apis/auth/routes"));

// middlewares after routes
app.use(errorHandler);
app.use(notfoundHandler);

// start the server
initializeDatabase()
  .then(() => {
    app.listen(config.port, () => {
      console.log("Your app is running on port", config.port);
    });
  })
  .catch((error) => {
    console.log("Database initialization failed:", error);
  });
