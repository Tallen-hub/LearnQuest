const express = require("express");
const database = require("../connect");
const ObjectId = require("mongodb").ObjectId;

const app = express();
app.use(express.json()); // Middleware to parse incoming JSON requests

const isTutor = async (request, response, next) => {
    let { userId } = request.body; // Extracts userId from the request body
    if (request?.params?.userId) {
        userId = request.params.userId; // If userId exists in the URL parameters, it overrides the body value
    }
    if (!userId) {
        console.log('not found');
        return response.status(400).json({ message: "ID is required" }); // Returns error if userId is not provided
    }

    let Oid = new ObjectId(userId); // Converts userId to MongoDB ObjectId format

    try {
        let db = await database.getDb(); // Connects to the database
        const user = await db.collection("users").findOne(
            { _id: Oid }, 
            { projection: { role: 1 } } // Retrieves only the role of the user from the database
        );
        if (!user) {
            return response.status(404).json({ message: "User not found" }); // Returns error if user is not found
        }
        if (user.role !== "tutor") {
            return response.status(403).json({ message: "Access denied: Not a tutor" }); // Denies access if the user is not a tutor
        }
        console.log('tutor detected');
        next(); // Proceeds to the next middleware if the user is a tutor
    } catch (error) {
        console.error("Error in isTutor middleware:", error); 
        response.status(500).json({ message: "Internal server error" }); // Handles any server errors
    }
};

module.exports = isTutor;
