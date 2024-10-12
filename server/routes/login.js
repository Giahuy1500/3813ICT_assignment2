module.exports = function (db, app) {
  app.post("/api/login", (req, res) => {
    if (!req.body) {
      return res.sendStatus(400); // Bad Request
    }

    const user = req.body;
    console.log(user);
    const collection = db.collection("users"); // Access the 'user' collection

    // Find the user with matching username and password
    collection
      .findOne({ email: user.email, password: user.password })
      .then((data) => {
        if (data) {
          return res.send({ status: "ok", user: user.email });
        } else {
          return res.send({ err: "login failed" });
        }
      })
      .catch((error) => {
        console.error(error);
        return res.sendStatus(500); // Internal Server Error
      });
  });
};
