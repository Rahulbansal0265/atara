require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var path = require("path");
var cookieParser = require("cookie-parser");
var baseMiddleware = require("./config/baseMiddleware");
var session = require("express-session");
var logger = require("morgan");
const fileUpload = require("express-fileupload");
var cors = require("cors");
var flash = require("express-flash");
const helper = require("./helpers/helper");

var indexRouter = require("./routes/index");
const apiRouter = require("./routes/apiroutes");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
    // tempFileDir : '/tmp/'
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "XCR3rsasa%RDHHH",
    cookie: {
      maxAge: 24 * 60 * 60 * 365 * 1000,
    },
  })
);
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
app.use(baseMiddleware);

app.use("/", indexRouter);
app.use("/api", apiRouter);

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(function (err, req, res, next) {
  if (err) {
    if (err.name == "UnauthorizedError")
      return helper.error(res, "No authorization token was found");

    // render the error page
    res.status(err.status || 500);
  }

  return next();
});

require("./shocket/socket")(io);

const PORT = 8049;

http.listen(PORT, (err, res) => {
  if (err) throw err;
  console.log(`server is listening on port: `, PORT);
});

module.exports = app;
