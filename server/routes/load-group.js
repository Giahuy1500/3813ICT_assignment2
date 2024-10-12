module.exports = function (db, app) {
  app.get("/api/load-groups", (req, res) => {
    const collection = db.collection("groups");

    // Retrieve all groups from the database
    collection
      .find({})
      .toArray()
      .then((groups) => {
        if (groups.length > 0) {
          return res.status(200).send({ success: true, groups: groups });
        } else {
          return res
            .status(404)
            .send({ success: false, err: "No groups found." });
        }
      })
      .catch((err) => {
        console.log("Error:", err.message);
        return res.status(500).send({
          success: false,
          err: "Error loading groups: " + err.message,
        });
      });
  });
};
