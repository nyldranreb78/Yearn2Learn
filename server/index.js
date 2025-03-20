require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");
const corsOptions = require("./config/cors");
const connectDB = require("./config/database");
const credentials = require("./middleware/credentials");
const errorHandlerMiddleware = require("./middleware/error_handler");
const authenticationMiddleware = require("./middleware/authentication");

const app = express();
const PORT = 3000;

connectDB();

// Allow Credentials
app.use(credentials);

// CORS
app.use(cors(corsOptions));

// application.x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// application/json response
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

app.use(authenticationMiddleware);

// static files
app.use("/static", express.static(path.join(__dirname, "public")));

// Default error handler
app.use(errorHandlerMiddleware);

// Routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/folder", require("./routes/api/folder"));
app.use("/api/note", require("./routes/api/note"));
app.use("/api/task", require("./routes/api/task"));
app.use("/api/flashcard", require("./routes/api/flashcard"));

app.all("*", (req, res) => {
  res.status(404);

  if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("text").send("404 Not Found");
  }
});

mongoose.connection.on("error", (error) => console.error(error));
mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});

module.exports = app;
