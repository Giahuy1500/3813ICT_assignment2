module.exports = {
  connect: function (io, PORT) {
    io.on("connection", (socket) => {
      console.log("User connection on PORT " + PORT + " " + socket.id);
      socket.on("message", (message) => {
        io.emit("message", message);
      });
      socket.on("joinChannel", (channelId, userId) => {
        socket.join(channelId);
        io.to(channelId).emit("userJoined", { channelId, userId });
      });

      // Handle user leaving a channel
      socket.on("leaveChannel", (channelId, userId) => {
        socket.leave(channelId);
        io.to(channelId).emit("userLeft", { channelId, userId });
      });

      // When the client disconnects
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  },
};
