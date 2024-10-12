//get tutor by unique id and role ==tutor
//get avability from frontend 
//store/create that tutor avability in the database
//create and read routes for tutor avability right now
const express = require("express");
const database = require("./connect");
const ObjectId = require("mongodb").ObjectId;

let tutorAvailabilityRoutes = express.Router();

tutorAvailabilityRoutes.route("/tutor/availability").post(async (request, response) => {
    let db = database.getDb();

    console.log("Received payload:", request.body);  // Log the payload

    try {
        // Step 1: Check if the tutor exists in the 'users' collection
        let tutor = await db.collection("users").findOne({
            _id: new ObjectId(request.body.tutorId),  // Convert the tutorId string to ObjectId
            role: "tutor"  // Ensure the user is a tutor
        });

        if (!tutor) {
            return response.status(404).json({ message: "Tutor not found" });
        }

        // Step 2: Check if availability already exists in 'tutorAvailability' for this tutor
        let existingAvailability = await db.collection("tutorAvailability").findOne({
            tutorId: request.body.tutorId  // Use the tutorId as a string
        });

        if (existingAvailability) {
            // Step 3: If availability exists, update it
            let result = await db.collection("tutorAvailability").updateOne(
                { tutorId: request.body.tutorId },  // Query by tutorId (ensure it's a string)
                { $set: { availability: request.body.availability } }  // Update the availability field
            );

            if (result.modifiedCount > 0) {
                response.status(200).json({ message: "Tutor availability updated" });
            } else {
                response.status(500).json({ message: "Failed to update tutor availability or no changes detected" });
            }
        } else {
            // Step 4: If no availability exists, create a new one
            let availabilityData = {
                tutorId: request.body.tutorId,  // Store the tutorId as a string
                availability: request.body.availability  // Store the array of availability time slots
            };

            console.log("Inserting new availability data:", availabilityData);  // Log data before inserting

            let result = await db.collection("tutorAvailability").insertOne(availabilityData);

            if (result.insertedId) {
                response.status(201).json({ message: "Tutor availability created", availabilityId: result.insertedId });
            } else {
                response.status(500).json({ message: "Failed to create tutor availability" });
            }
        }
    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate key error (unique constraint violation)
            response.status(400).json({ message: "Tutor availability already exists." });
        } else {
            console.error("Error:", error);
            response.status(500).json({ message: "An error occurred." });
        }
    }
});





// 3. Read tutor availability by tutor ID
tutorAvailabilityRoutes.route("/tutor/availability/:tutorId").get(async (request, response) => {
    let db = database.getDb();
    let data = await db.collection("tutorAvailability").findOne({
        tutorId: request.params.tutorId
    });

    if (data) {
        response.json(data);
    } else {
        response.status(404).json({ message: "Availability not found" });
    }
});

module.exports = tutorAvailabilityRoutes;