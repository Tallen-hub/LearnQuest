const express = require("express");
const database = require("./connect");
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");

let commonRoutes = express.Router();
const SALT_ROUNDS = 10;

// Signup route
commonRoutes.route("/signup").post(async (request, response) => {
    try {
        let db = database.getDb();
        console.log(request.body);

        // Extracting data from request body
        const { name, email, password, role } = request.body;

        if (!name || !email || !password || !role) {
            return response.status(400).json({ message: "Missing required fields." });
        }

        const takenEmail = await db.collection("users").findOne({ email });
        if (takenEmail) {
            return response.status(400).json({ message: "Email already taken." });
        }

        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        const mongoObject = {
            name,
            email,
            password: hash,
            role,
            joinDate: new Date(),
            appointments: []
        };

        const result = await db.collection("users").insertOne(mongoObject);

        // Return the insertedId for frontend navigation
        response.status(200).json({ insertedId: result.insertedId });
    } catch (error) {
        response.status(500).json({ message: "Error signing up.", error });
    }
});

// Login route
commonRoutes.route("/login").post(async (request, response) => {
    try {
        let db = database.getDb();
        console.log(request.body);

        const { email, password } = request.body;

        const user = await db.collection("users").findOne({ email });
        if (!user) {
            return response.status(404).json({ success: false, message: "User not found." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            delete user.password; // Avoid sending the password back
            response.status(200).json({ success: true, user });
        } else {
            response.status(400).json({ success: false, message: "Incorrect password." });
        }
    } catch (error) {
        response.status(500).json({ message: "Error logging in.", error });
    }
});


commonRoutes.route('/api/logout').post((req, res) => {
    res.status(200).send('Logged out successfully');
});
module.exports = commonRoutes;
