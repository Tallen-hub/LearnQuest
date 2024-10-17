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
userRoutes.route("/getUser/:id").get(async (request, response) => {
    let db = database.getDb();
    // Validate tha the id is a valid ObjectId
    if (!ObjectId.isValid(request.params.id)) {
        return response.status(400).json({ message: "Invalid user ID" });
    }

    let data = await db.collection("users").findOne({ _id: new ObjectId(request.params.id) });
    if (data) {
        delete data.password;
        response.json(data);
    } else {
        response.json({ message: "Data was not found :(" });
    }
});

// Create One
userRoutes.route("/signup").post(async (request, response) => {
    let db = database.getDb();
    console.log('signup');

    // Extracting data from request body
    const { name, email, password, role } = request.body;

    // Check for missing fields
    if (!name || !email || !password || !role) {
        return response.status(400).json({ message: "Missing required fields" });
    }

    const takenEmail = await db.collection("users").findOne({ email });
    if (takenEmail) {
        return response.status(400).json({ message: "Email already taken" });
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    let mongoObject = {
        name,
        email,
        password: hash,
        role,
        joinDate: new Date(),
        appointments: []
    };

    let result = await db.collection("users").insertOne(mongoObject);

    // Return the insertedId so the frontend can use it to navigate
    response.status(200).json({ insertedId: result.insertedId });
});


// Update One
userRoutes.route("/manage/:id").put(async (request, response) => {
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
userRoutes.route("/manage/:id").delete(async (request, response) => {
    let db = database.getDb();

    // Validate that the id is a valid ObjectId
    if (!ObjectId.isValid(request.params.id)) {
        return response.status(400).json({ message: "Invalid user ID" });
    }

    let data = await db.collection("users").deleteOne({ _id: new ObjectId(request.params.id) });
    response.json(data);
});

// Login


userRoutes.route("/bookTutor").post(async (request, response) => {
    let db = database.getDb();
    const { userId, timeId, tutorId } = request.body;

    // Check for missing fields
    if (!userId || !timeId || !tutorId) {
        return response.status(400).json({ message: "Missing required fields" });
    }

    try {
        // Find the user from the users collection
        const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
        delete user.password;
        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        const tutor = await db.collection("users").findOne({ _id: new ObjectId(tutorId) });
        delete tutor.password;
        if (!tutor) {
            return response.status(404).json({ message: "Tutor not found" });
        }

        // Check if the user has already booked a session with the same tutor
        const existingBooking = await db.collection("bookings").findOne({
            userId: new ObjectId(userId),
            timeId: timeId,
        });

        if (existingBooking) {
            return response.status(400).json({ message: "You have already booked a session with this tutor for the same time. Please wait for approval from the faculty." });
        }

        // Find the availability by timeId in the tutorAvailability collection
        const availability = await db.collection("tutorAvailability").findOne({ "availability.slots.id": timeId });

        if (!availability) {
            return response.status(404).json({ message: "Time slot not found" });
        }

        // Check if the time slot is booked
        const slots = availability.availability.flatMap(day => day.slots);
        const slot = slots.find(slot => slot.id === timeId);

        console.log(slot.id, timeId);

        if (slot) {
            // Proceed to book the slot
            const dayDetails = availability.availability.find(day => day.slots.some(s => s.id === timeId));
            const bookingDate = getNextDate(dayDetails.day, formatTo24Hour(slot.start)); // Get the next date for the specified day

            // Create the booking object
            const bookingDetails = {
                userId: user._id,
                Name: user.name,
                Tutor: tutor.name,
                tutorId: tutorId,
                timeId: timeId,
                day: dayDetails.day,
                startTime: formatTo24Hour(slot.start),
                endTime: formatTo24Hour(slot.end),
                approvalStatus: 0, // 0 for pending
                date: bookingDate // Save the date here
            };

            // Insert the booking into the bookings collection
            await db.collection("bookings").insertOne(bookingDetails);

            console.log(`Booking created successfully for user ${user.name} on ${dayDetails.day} from ${slot.start} to ${slot.end}.`);

            return response.status(200).json({ message: "Booking created successfully", bookingDetails });
        } else {
            return response.status(404).json({ message: "Time slot not found in availability" });
        }

    } catch (error) {
        console.error("Error while booking tutor slot:", error);
        return response.status(500).json({ message: "Internal server error" });
    }
});


userRoutes.route("/bookings/:userId").get(async (request, response) => {
    let db = database.getDb();
    const { userId } = request.params;

    try {
        // Fetch all bookings for the given userId
        const bookings = await db.collection("bookings").find({ userId: new ObjectId(userId) }).toArray();

        if (bookings.length === 0) {
            return response.status(404).json({ message: "No bookings found for this user." });
        }

        // Return booking details
        return response.status(200).json({ bookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return response.status(500).json({ message: "Internal server error" });
    }
});

function getNextDate(dayName, time) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const todayIndex = today.getDay();
    const dayIndex = daysOfWeek.indexOf(dayName);

    let daysUntilNext = (dayIndex - todayIndex + 7) % 7;
    console.log(daysUntilNext)
    // If the requested day is today
    if (daysUntilNext === 0) {
        const [bookingHour, bookingMinute] = time.split(':').map(Number);
        const bookingTime = new Date(today);
        bookingTime.setHours(bookingHour, bookingMinute, 0, 0); // Set booking time
        console.log(bookingTime, today)
        // Check if the current time is less than the booking time
        if (today < bookingTime) {
            console.log("today")
            return formatDate(today); // Allow booking for today
        } else {
            console.log("next week")
            daysUntilNext = 7; // If current time exceeds booking time, set to next week
        }
    }

    today.setDate(today.getDate() + daysUntilNext);
    return formatDate(today); // Return the next available date
}

// Helper function to format date in yyyy-mm-dd
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Example usage
function formatTo24Hour(timeStr) {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");

    // Convert hours to number for manipulation
    hours = parseInt(hours, 10);

    if (modifier === "PM" && hours !== 12) {
        hours += 12; // Convert PM hours to 24-hour format
    } else if (modifier === "AM" && hours === 12) {
        hours = 0; // Convert 12 AM to 0 hours
    }

    // Pad hours with leading zero if needed
    const paddedHours = hours.toString().padStart(2, '0');

    // Return the formatted time
    return `${paddedHours}:${minutes}`;
}



module.exports = userRoutes;

