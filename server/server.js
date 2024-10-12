const express = require("express");
const bodyParser = require("body-parser");

const PORT = 3030;
const app = express();
const http = require("http").Server(app);
const { MongoClient, ObjectID, ObjectId } = require("mongodb");
const cors = require("cors");
const client = new MongoClient("mongodb://localhost:27017/");
const dbName = "chat_app";
const sockets = require("./socket.js");
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
  },
});
const server = require("./listen.js");

// parse requests

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//setup Socket
sockets.connect(io, PORT);
//sever listen
server.listen(http, PORT);

client.connect();
const db = client.db(dbName);
//Set up routes
require("./routes/create-user.js")(db, app);
require("./routes/login.js")(db, app);
require("./routes/create-group.js")(db, app);
require("./routes/load-group.js")(db, app);
require("./routes/delete-group.js")(db, app);
