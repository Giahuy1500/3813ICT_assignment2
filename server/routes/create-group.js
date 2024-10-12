module.exports = function (db, app) {
  app.post("/api/create-group", (req, res) => {
    let body = req.body;

    // Validate the incoming group data
    if (!body || !body.name) {
      return res.status(400).send({ num: 0, err: "Invalid group data" });
    }

    const collection = db.collection("groups");

    // Insert the new group
    collection
      .insertOne({
        name: body.name,
        channels: body.channels,
        users: body.users,
      })
      .then((result) => {
        if (result.acknowledged === true) {
          // Create the response with the inserted group's _id
          return res.status(200).send({
            num: 1,
            err: null,
            group: {
              _id: result.insertedId,
              name: body.name,
              channels: body.channels,
              users: body.users,
            },
          });
        } else {
          return res
            .status(500)
            .send({ num: 0, err: "Failed to create group." });
        }
      })
      .catch((err) => {
        console.log("Error:", err.message);
        return res
          .status(500)
          .send({ num: 0, err: "Error creating group: " + err.message });
      });
  });
};
