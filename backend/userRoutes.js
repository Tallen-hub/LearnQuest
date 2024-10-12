const express = require("express");
const database = require("./connect");
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");

let userRoutes = express.Router();
const SALT_ROUNDS = 10;

// 1. Read All
userRoutes.route("/users").get(async (request, response) => {
    let db = database.getDb();
    let data = await db.collection("users").find({}).toArray();
    if (data.length > 0) {
        response.json(data);
    } else {
        response.json({ message: "Data was not found :(" });
    }
});

// Read One
userRoutes.route("/users/:id").get(async (request, response) => {
    let db = database.getDb();

    // Validate that the id is a valid ObjectId
    if (!ObjectId.isValid(request.params.id)) {
        return response.status(400).json({ message: "Invalid user ID" });
    }

    let data = await db.collection("users").findOne({ _id: new ObjectId(request.params.id) });
    if (data) {
        response.json(data);
    } else {
        response.json({ message: "Data was not found :(" });
    }
});

// Create One
userRoutes.route("/users").post(async (request, response) => {
    let db = database.getDb();
    
    const takenEmail = await db.collection("users").findOne({ email: request.body.email });
    if (takenEmail) {
        response.status(400).json({ message: "Email already taken" });
    } else {
        const hash = await bcrypt.hash(request.body.password, SALT_ROUNDS);
        let mongoObject = {
            name: request.body.name,
            email: request.body.email,
            password: hash,
            role: request.body.role,
            joinDate: new Date(),
            appointments: []
        };
        let result = await db.collection("users").insertOne(mongoObject);
        
        // Return the insertedId so the frontend can use it to navigate
        response.status(200).json({ insertedId: result.insertedId });
    }
});

// Update One
userRoutes.route("/users/:id").put(async (request, response) => {
    let db = database.getDb();

    // Validate that the id is a valid ObjectId
    if (!ObjectId.isValid(request.params.id)) {
        return response.status(400).json({ message: "Invalid user ID" });
    }

    let updateData = {
        $set: {
            name: request.body.name,
            email: request.body.email,
            role: request.body.role,
            joinDate: request.body.joinDate,
            appointments: request.body.appointments,
        }
    };

    if (request.body.password) {
        updateData.$set.password = await bcrypt.hash(request.body.password, SALT_ROUNDS);
    }

    let result = await db.collection("users").updateOne({ _id: new ObjectId(request.params.id) }, updateData);
    
    if (result.modifiedCount > 0) {
        response.json({ message: "User updated successfully" });
    } else {
        response.json({ message: "User not found or no changes made" });
    }
});

// DELETE One
userRoutes.route("/users/:id").delete(async (request, response) => {
    let db = database.getDb();

    // Validate that the id is a valid ObjectId
    if (!ObjectId.isValid(request.params.id)) {
        return response.status(400).json({ message: "Invalid user ID" });
    }

    let data = await db.collection("users").deleteOne({ _id: new ObjectId(request.params.id) });
    response.json(data);
});

// Login
userRoutes.route("/users/login").post(async (request, response) => {
    let db = database.getDb();

    const user = await db.collection("users").findOne({ email: request.body.email });
    
    if (user) {
        let confirmation = await bcrypt.compare(request.body.password, user.password);
        if (confirmation) {
            response.status(200).json({ success: true, user });
        } else {
            response.status(400).json({ success: false, message: "Incorrect password" });
        }
    } else {
        response.status(404).json({ success: false, message: "User not found" });
    }
});

module.exports = userRoutes;

