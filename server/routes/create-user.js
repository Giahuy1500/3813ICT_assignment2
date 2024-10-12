module.exports = function (db, app) {
  app.post("/api/create-user", (req, res) => {
    let user = req.body;
    // Check if user data is provided
    if (!user) {
      return res.status(400).send({ num: 0, err: "User data is required" });
    }

    const collection = db.collection("users");

    // Check for duplicate user by email
    collection
      .countDocuments({ email: user.email })
      .then((count) => {
        if (count !== 0) {
          console.log("Duplicate email found:", user.email); // Log duplicate issue
          return res.status(400).send({ num: 0, err: "Duplicate email" });
        }

        // Insert the new user
        return collection.insertOne(user);
      })
      .then((result) => {
        if (result && result.acknowledged === true) {
          return res.status(200).send({ num: 1, err: null }); // Return success response
        } else {
          return res
            .status(500)
            .send({ num: 0, err: "Failed to create user." });
        }
      })
      .catch((err) => {
        console.log("Error:", err.message);
        return res
          .status(500)
          .send({ num: 0, err: "Error creating user: " + err.message });
      });
  });
  app.get("/api/load-users", (req, res) => {
    const collection = db.collection("users");

    // Find all users and return as an array
    collection
      .find({})
      .toArray()
      .then((users) => {
        return res
          .status(200)
          .send({ num: users.length, users: users, err: null });
      })
      .catch((err) => {
        console.log("Error:", err.message);
        return res
          .status(500)
          .send({ num: 0, err: "Error loading users: " + err.message });
      });
  });

  app.post("/api/load-groups-by-user-email", (req, res) => {
    let email = req.body.email; // Retrieve the email from the request body
    const usersCollection = db.collection("users");

    // Check if email is provided
    if (!email) {
      return res.status(400).send({ num: 0, err: "Email is required" });
    }

    // Find the user by email and return their groups
    usersCollection
      .findOne({ email: email })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ num: 0, err: "User not found" });
        }

        // Check if the user has groups; return an empty array if none are found
        const groups = user.groups || [];

        // If the user exists, return their groups
        return res.status(200).send({
          num: groups.length,
          groups: groups,
          err: null,
        });
      })
      .catch((err) => {
        console.log("Error:", err.message);
        return res
          .status(500)
          .send({ num: 0, err: "Error loading groups: " + err.message });
      });
  });
};
