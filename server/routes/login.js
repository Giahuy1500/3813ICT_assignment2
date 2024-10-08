module.exports = function(app, db) {
    app.post('/api/login', async (req, res) => {
        if (!req.body) {
            return res.sendStatus(400);
        }
        const user = req.body;
        try {
            const collection = db.collection('user'); // Corrected to 'collection'
            const data = await collection.findOne({ username: user.username, password: user.password });
            if (data) {
                return res.send({ status: "ok" });
            } else {
                return res.send({ err: "login failed" });
            }
        } catch (error) {
            console.error(error);
            return res.sendStatus(500); // Internal Server Error
        }
    });
};
