// Module loading.
const express = require("express");
const history = require("connect-history-api-fallback");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const fs = require("fs");
const http = require("http");
const https = require("https");

const userRoutes = require("./routes/user.routes");
const groupRoutes = require("./routes/group.routes");
const noticeRoutes = require("./routes/notice.routes");
const travelRoutes = require("./routes/travel.routes");
const publicationRoutes = require("./routes/publication.routes");


// Express module instance.
const app = express();

// NOTE: Enable CORS, Development mode ONLY
const cors = require("cors");
app.use(cors({
    origin: "http://localhost:8080",
	credentials: true
}));

// Enable:
// body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// catch-all fallback route (vue history mode)
app.use(history());
// client folder
app.use(express.static(path.join(__dirname, "../client/dist/")));
// public folder
app.use("/media", express.static(path.join(__dirname, "public/")));
// cookie-parser module
app.use(cookieParser());

// Loading environment variables from .env file.
dotenv.config();


// express-session module (req.session).
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    name: "_wawalk",
    saveUninitialized: false,
    cookie: {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24, // 24 h.
        sameSite: true,
        // secure: true,
        // httpOnly: true
    },
    rolling: true
}));
app.use(passport.initialize());
app.use(passport.session());


// routes/web.routes.js
app.use("/users/", userRoutes);
app.use("/groups/", groupRoutes);
app.use("/notices/", noticeRoutes);
app.use("/travels/", travelRoutes);
app.use("/publications/", publicationRoutes);


// mongoose module & connection.
const mongoOptions = {
    keepAlive: 1,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
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


// SocketIO module.
// NOTE: Choose server according to mode.
const io = require("socket.io")(httpServer);

var socketClients = [];

io.sockets.on("connection", function(socket) {
    // Store connected user.
    socket.on("storeClient", user => {
        socketClients.push({
            client: user,
            id: socket.id
        });
    });

    // Notify user.
    socket.on("notify", user => {
        socketClients.map(i => i.client === user? socket.broadcast.to(i.id).emit('newNotice') : i);
    });

    // Join room/s.
    socket.on("joinGroups", groups => {
        groups.map(i => socket.join(i));
    });

    // Kick user from room or leave room.
    socket.on("leaveGroup", data => {
        if (data.user) {
            for (i = 0; i < socketClients.length; ++i) {
                if (socketClients[i].client === data.user) {
                    io.sockets.connected[socketClients[i].id].leave(data.group);
                    io.to(socketClients[i].id).emit("kickOut");
                    break;
                }
            }
        } else if (data.all) {
            let users = data.all.map(i => i = i.user.username);
            for (i = 0; i < socketClients.length; ++i) {
                if (users.includes(socketClients[i].client)) {
                    io.sockets.connected[socketClients[i].id].leave(data.group);
                    io.to(socketClients[i].id).emit("groupDeleted");
                }
            }
        } else {
            socket.leave(data.group);
        }
    });

    // Group message.
    socket.on("groupMsg", data => {
        io.in(data.group).emit("newMsg", {group: data.group, user: data.user, text: data.text, general: data.general});
    });

    // Disconnect.
    socket.on('disconnect', () => {
        for (i = 0; i < socketClients.length; ++i) {
            if (socketClients[i].id === socket.id) {
                socketClients.splice(i, 1);
                break;
            }
        }
    });
});
