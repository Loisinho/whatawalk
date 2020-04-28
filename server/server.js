// Module loading.
const express = require("express");
const history = require("connect-history-api-fallback");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const session = require("express-session");
const mongoose = require("mongoose");
const fs = require("fs");
const http = require("http");
const https = require("https");

const userRoutes = require("./routes/user.routes");


// Express module instance.
const app = express();

// Enable:
// body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// catch-all fallback route (vue history mode)
app.use(history());
// client folder
app.use(express.static(path.join(__dirname, "../client/dist/")));
// cookie-parser module
app.use(cookieParser());

// Loading environment variables from .env file.
dotenv.config();


// express-session module (req.session).
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    name: "_wawalk",
    saveUninitialized: true,
    cookie: {
        path: "/",
        maxAge: 1000 * 60 * 15, // 15 min.
        sameSite: true,
        // secure: true,
        // httpOnly: true
    },
    rolling: true,
}));


// routes/web.routes.js
app.use("/users/", userRoutes);


// mongoose module & connection.
const mongoOptions = {
    keepAlive: 1,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
};

var mongoDB = process.env.MONGODB_URI;

mongoose.connect(mongoDB, mongoOptions).catch(err =>
    console.log("Error connecting to MongoDB: " + err)
);

mongoose.connection.on("error", err =>
    console.log("MongoDB connection error: " + err)
);
mongoose.connection.on("connected", () =>
    console.log("Connected to MongoDB server.")
);


// HTTPS SSL Certs.
const privateKey = fs.readFileSync("./docs/certs/privkey.pem", "utf8");
const certificate = fs.readFileSync("./docs/certs/cert.pem", "utf8");
const ca = fs.readFileSync("./docs/certs/chain.pem", "utf8");

const certs = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

const httpServer = http.createServer(app);
var server = httpServer.listen(process.env.HTTP_PORT, () =>
    console.log(`HTTP server running on port ${process.env.HTTP_PORT}`)
);

const httpsServer = https.createServer(certs, app);
var server = httpsServer.listen(process.env.HTTPS_PORT, () =>
    console.log(`HTTPS server running on port ${process.env.HTTPS_PORT}`)
);
