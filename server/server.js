const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
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
require("./routes/group-operation.js")(db, app);
require("./routes/channel-operation.js")(db, app);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/upload/chat", upload.single("chatImage"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const filePath = path.join("uploads", req.file.filename);
  res.send({ filePath });
});
