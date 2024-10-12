const { ObjectId } = require("mongodb");
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
  app.post("/api/delete-group", (req, res) => {
    let body = req.body;

    // Check if the request body and _id are valid
    if (!body || !body._id) {
      return res
        .status(400)
        .send({ num: 0, err: "Invalid group data: Missing _id" });
    }

    const groupId = new ObjectId(body._id);
    const groupsCollection = db.collection("groups");
    const usersCollection = db.collection("users");

    // Step 1: Delete the group from the "groups" collection
    groupsCollection
      .deleteOne({ _id: groupId })
      .then((result) => {
        if (result.deletedCount === 0) {
          return res.status(404).send({ num: 0, err: "Group not found" });
        }

        // Step 2: Remove the group from all users' `groups` array in the "users" collection
        usersCollection
          .updateMany(
            {}, // Apply to all users
            { $pull: { groups: { _id: groupId } } } // Pull the group with the given _id from the groups array
          )
          .then((updateResult) => {
            console.log(
              "Group removed from users:",
              updateResult.modifiedCount
            );

            // Group successfully deleted and removed from users
            res.status(200).send({
              message: "Group deleted and removed from users successfully",
            });
          })
          .catch((err) => {
            console.error("Error updating users:", err);
            return res.status(500).send({
              num: 0,
              err: "Failed to remove group from users due to server error",
            });
          });
      })
      .catch((err) => {
        console.error("Delete error:", err);
        return res
          .status(500)
          .send({ num: 0, err: "Failed to delete group due to server error" });
      });
  });

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
  app.post("/api/add-user-to-group", (req, res) => {
    const body = req.body;
    console.log(body);
    // Check if groupId and username are provided
    if (!body) {
      return res
        .status(400)
        .send({ num: 0, err: "Group ID and Username are required" });
    }
    const group = {
      name: body.group.name,
      _id: new ObjectId(body.group._id),
    };
    const username = body.username;
    const usersCollection = db.collection("users");

    // Verify if the user exists
    usersCollection
      .findOne({ username: username })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ num: 0, err: "User not found" });
        }

        // Add the group to the user's groups array if not already present
        usersCollection
          .updateOne(
            { username: username }, // Find the user by username
            { $addToSet: { groups: group } } // Add the group object to the groups array, using $addToSet to avoid duplicates
          )
          .then((result) => {
            if (result.modifiedCount === 1) {
              return res.status(200).send({
                num: 1,
                err: null,
                message: "Group added to user successfully",
              });
            } else {
              return res.status(404).send({
                num: 0,
                err: "User not found or update failed",
              });
            }
          })
          .catch((err) => {
            console.log("Error updating user:", err.message);
            return res.status(500).send({
              num: 0,
              err: "Error updating user: " + err.message,
            });
          });
      })
      .catch((err) => {
        console.log("Error finding user:", err.message);
        return res.status(500).send({
          num: 0,
          err: "Error finding user: " + err.message,
        });
      });
  });
  const { ObjectId } = require("mongodb");

  app.post("/api/remove-user-from-group", (req, res) => {
    const body = req.body;

    // Check if groupId and username are provided
    if (!body) {
      return res
        .status(400)
        .send({ num: 0, err: "Group ID and Username are required" });
    }

    const groupId = new ObjectId(body.group._id); // Extract group ID and convert to ObjectId
    const username = body.username;
    const usersCollection = db.collection("users");

    // Verify if the user exists
    usersCollection
      .findOne({ username: username })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ num: 0, err: "User not found" });
        }

        // Step 1: Check if the user has a group with this `groupId`
        const group = user.groups.find((g) => g._id && g._id.equals(groupId));

        if (!group) {
          return res
            .status(404)
            .send({ num: 0, err: "Group not found in user's groups" });
        }

        // Step 2: Remove the group from the user's `groups` array using the group's _id
        usersCollection
          .updateOne(
            { username: username }, // Find the user by username
            { $pull: { groups: { _id: groupId } } } // Remove the group using its `_id`
          )
          .then((result) => {
            if (result.modifiedCount === 1) {
              return res.status(200).send({
                num: 1,
                err: null,
                message: "Group removed from user successfully",
              });
            } else {
              return res.status(404).send({
                num: 0,
                err: "Group not present in user's groups",
              });
            }
          })
          .catch((err) => {
            console.log("Error updating user:", err.message);
            return res.status(500).send({
              num: 0,
              err: "Error updating user: " + err.message,
            });
          });
      })
      .catch((err) => {
        console.log("Error finding user:", err.message);
        return res.status(500).send({
          num: 0,
          err: "Error finding user: " + err.message,
        });
      });
  });
};
