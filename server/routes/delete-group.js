const { ObjectId } = require("mongodb");

module.exports = function (db, app) {
  app.post("/api/delete-group", (req, res) => {
    let body = req.body;

    // Check if the request body and _id are valid
    if (!body || !body._id) {
      return res
        .status(400)
        .send({ num: 0, err: "Invalid group data: Missing _id" });
    }

    const collection = db.collection("groups");
    const groupId = new ObjectId(body._id);

    // Try to delete the group using promise-based syntax
    collection
      .deleteOne({ _id: groupId })
      .then((result) => {
        console.log("Delete result:", result);

        if (result.deletedCount === 0) {
          return res.status(404).send({ num: 0, err: "Group not found" });
        }

        // Group successfully deleted
        res.status(200).send({ message: "Group deleted successfully" });
      })
      .catch((err) => {
        console.error("Delete error:", err);
        return res
          .status(500)
          .send({ num: 0, err: "Failed to delete group due to server error" });
      });
  });
};
