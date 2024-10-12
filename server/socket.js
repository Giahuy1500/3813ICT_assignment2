module.exports = {
  connect: function (io, PORT) {
    io.on("connection", (socket) => {
      console.log("User connection on PORT " + PORT + " " + socket.id);
      socket.on("message", (message) => {
        io.emit("message", message);
      });
    });
  },
};
