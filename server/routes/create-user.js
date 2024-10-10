module.exports = function (db, app) {
  app.post("/api/create-user", async (req, res) => {
    try {
      let user = req.body;

      // Check if user data is provided
      if (!user) {
        return res.status(400).send({ num: 0, err: "User data is required" });
      }

      const collection = db.collection("users");

      // Check for duplicate user by email
      const count = await collection.countDocuments({ email: user.email });
      if (count !== 0) {
        console.log("Duplicate email found:", user.email); // Log duplicate issue
        return res.status(400).send({ num: 0, err: "Duplicate email" });
      }

      // Insert the new user
      const result = await collection.insertOne(user);
      console.log(result);

      // Check if the insertion was successful
      if (result.acknowledged === true) {
        return res.status(200).send({ num: 1, err: null }); // Return success response
      } else {
        return res.status(500).send({ num: 0, err: "Failed to create user." });
      }
    } catch (err) {
      console.log("Error:", err.message);
      return res
        .status(500)
        .send({ num: 0, err: "Error creating user: " + err.message });
    }
  });
};
