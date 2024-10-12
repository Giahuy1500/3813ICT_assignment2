const { ObjectId } = require("mongodb");
module.exports = function (db, app) {
  app.post("/api/create-channel", (req, res) => {
    let body = req.body;
    console.log(req.body);
    // Validate the incoming data
    if (!body || !body.groupId || !body.channel) {
      return res.status(400).send({ num: 0, err: "Invalid data" });
    }

    const groupId = body.groupId;
    const newChannel = body.channel;

    // Validate channel data
    if (!newChannel.name) {
      return res.status(400).send({ num: 0, err: "Invalid channel data" });
    }

    const collection = db.collection("groups");

    // Find the group by ID and add the new channel
    collection
      .updateOne(
        { _id: new ObjectId(groupId) }, // Find the group by its ID
        { $push: { channels: newChannel } } // Add the new channel to the channels array
      )
      .then((result) => {
        if (result.modifiedCount === 1) {
          // Successfully added the channel
          return res.status(200).send({
            num: 1,
            err: null,
            channel: newChannel,
          });
        } else {
          return res
            .status(500)
            .send({ num: 0, err: "Failed to create channel." });
        }
      })
      .catch((err) => {
        console.log("Error:", err.message);
        return res
          .status(500)
          .send({ num: 0, err: "Error creating channel: " + err.message });
      });
  });

  app.post("/api/delete-channel", (req, res) => {
    let body = req.body;
    console.log(req.body);

    // Validate the incoming data
    if (!body || !body.groupId || !body.channelName) {
      return res.status(400).send({ num: 0, err: "Invalid data" });
    }

    const groupId = body.groupId;
    const channelName = body.channelName;

    const collection = db.collection("groups");

    // Find the group by ID and remove the channel by its name
    collection
      .updateOne(
        { _id: new ObjectId(groupId) }, // Find the group by its ID
        { $pull: { channels: { name: channelName } } } // Remove the channel that matches the name
      )
      .then((result) => {
        if (result.modifiedCount === 1) {
          // Successfully deleted the channel
          return res.status(200).send({
            num: 1,
            err: null,
            message: `Channel '${channelName}' deleted successfully`,
          });
        } else {
          return res
            .status(500)
            .send({ num: 0, err: "Failed to delete channel." });
        }
      })
      .catch((err) => {
        console.log("Error:", err.message);
        return res
          .status(500)
          .send({ num: 0, err: "Error deleting channel: " + err.message });
      });
  });

  app.post("/api/load-channels-from-group", (req, res) => {
    const { email, groupId } = req.body; // Extract username and groupId from the request body
    console.log(req.body);

    const usersCollection = db.collection("users");
    const groupsCollection = db.collection("groups");

    // Validate that groupId is a valid ObjectId
    if (!ObjectId.isValid(groupId)) {
      return res.status(400).send({ err: "Invalid Group ID" });
    }

    // Find the user by username
    usersCollection
      .findOne({ email: email })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ err: "User not found" });
        }

        // Check if the user has this group in their groups array
        const groupExistsInUser = user.groups.some(
          (g) => g._id && g._id.equals(new ObjectId(groupId))
        );

        if (!groupExistsInUser) {
          return res
            .status(404)
            .send({ err: "Group not found in user's groups" });
        }

        // Step 2: Fetch the group from the `groups` collection by `_id`
        return groupsCollection.findOne({ _id: new ObjectId(groupId) });
      })
      .then((group) => {
        if (!group) {
          return res
            .status(404)
            .send({ err: "Group not found in groups collection" });
        }

        // Return the channels in the group
        return res.status(200).send({ channels: group.channels });
      })
      .catch((err) => {
        console.log("Error:", err.message);
        return res
          .status(500)
          .send({ err: "Error loading channels: " + err.message });
      });
  });
};
