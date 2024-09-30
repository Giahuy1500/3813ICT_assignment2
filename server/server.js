const express = require('express');
const bodyParser = require('body-parser');
const PORT = 3030;
const app = express();
const http = require('http').Server(app);
const { MongoClient, ObjectID } = require('mongodb');
const cors = require('cors');
const client = new MongoClient('mongodb://localhost:27017/');
const dbName = 'chat-application';

// parse requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

async function main() {
    try {
        await client.connect();
        console.log("Connected to MongoDB successfully");

        const db = client.db(dbName);
        const collection = db.collection('products');
        //Setup routes

    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
    }
}

main().catch(err => {
    console.error("An error occurred in the main function:", err);
});
