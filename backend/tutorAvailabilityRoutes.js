//get tutor by unique id and role ==tutor
//get avability from frontend 
//store/create that tutor avability in the database
//create and read routes for tutor avability right now
const express = require("express");
const database = require("./connect");
const ObjectId = require("mongodb").ObjectId;
const isTutor = require('./Middlewares/isTutor')
const { uuid } = require('uuidv4');
const { compareSync } = require("bcrypt");



let tutorAvailabilityRoutes = express.Router();
tutorAvailabilityRoutes.post('/test', isTutor, async (req, res) => {
    return res.status(200).json({ message: "ok working" })
})
// POST: Create or update tutor availability
tutorAvailabilityRoutes.post("/availability", isTutor, async (request, response) => {
    let db = database.getDb();
    let selectedSubjects = request.body.availability.selectedSubjects;

    try {
        let tutor = await db.collection("users").findOne({
            _id: new ObjectId(request.body.userId),
        });

        if (!tutor) {
            return response.status(404).json({ message: "Tutor not found" });
        }

        let existingAvailability = await db.collection("tutorAvailability").findOne({
            tutorId: request.body.userId
        });

        const availabilityWithIds = request.body.availability.availability.map(day => ({
            ...day,
            slots: day.slots.map(slot => {
                const existingDay = existingAvailability?.availability.find(d => d.day === day.day);
                const existingSlot = existingDay?.slots.find(s => s.start === slot.start && s.end === slot.end);

                return {
                    ...slot,
                    id: existingSlot ? existingSlot.id : uuid(),
                    isBooked: existingSlot ? existingSlot.isBooked : false
                };
            }),
        }));

        if (existingAvailability) {
            const hasAvailabilityChanged = JSON.stringify(existingAvailability.availability) !== JSON.stringify(availabilityWithIds);
            const hasSubjectsChanged = JSON.stringify(existingAvailability.selectedSubjects) !== JSON.stringify(selectedSubjects);

            if (hasAvailabilityChanged || hasSubjectsChanged) {
                let result = await db.collection("tutorAvailability").updateOne(
                    { tutorId: request.body.userId },
                    { $set: { availability: availabilityWithIds, selectedSubjects: selectedSubjects } }
                );

                if (result.modifiedCount > 0) {
                    response.status(200).json({ message: "Tutor availability and/or subjects updated" });
                } else {
                    response.status(500).json({ message: "Failed to update tutor availability or no changes detected" });
                }
            } else {
                response.status(200).json({ message: "No changes detected in availability or subjects" });
            }
        } else {
            let result = await db.collection("tutorAvailability").insertOne({
                tutorId: request.body.userId,
                availability: availabilityWithIds,
                selectedSubjects: selectedSubjects,
            });

            if (result.insertedId) {
                response.status(201).json({ message: "Tutor availability created", availabilityId: result.insertedId });
            } else {
                response.status(500).json({ message: "Failed to create tutor availability" });
            }
        }
    } catch (error) {
        if (error.code === 11000) {
            response.status(400).json({ message: "Tutor availability already exists." });
        } else {
            console.error("Error:", error);
            response.status(500).json({ message: "An error occurred." });
        }
    }
});


// GET: Fetch tutor availability by tutor ID
tutorAvailabilityRoutes.get("/availability/:userId", isTutor, async (request, response) => {
    let db = database.getDb();
    tutorId = request.params.userId
    let data = await db.collection("tutorAvailability").findOne({
        tutorId
    });

    if (data) {
        response.json(data);
    } else {
        response.status(404).json({ message: "Availability not found" });
    }
});

// GET: Fetch tutors who have availability
tutorAvailabilityRoutes.get("/available", async (request, response) => {
    let db = database.getDb();

    try {
        let tutorsWithAvailability = await db.collection("tutorAvailability").aggregate([
            {
                $addFields: {
                    tutorId: { $toObjectId: "$tutorId" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "tutorId",
                    foreignField: "_id",
                    as: "tutorInfo"
                }
            },
            {
                $unwind: "$tutorInfo"
            },
            {
                $match: {
                    "tutorInfo.role": "tutor",
                    "availability.enabled": true // Match tutors who have availability enabled
                }
            },
            {
                $project: {
                    "tutorInfo.name": 1,
                    "tutorInfo._id": 1,
                    "selectedSubjects":1,
                    "availability": {
                        $filter: {
                            input: "$availability", // The availability array
                            as: "day", // Each item in the availability array
                            cond: { $eq: ["$$day.enabled", true] } // Only include days that are enabled
                        }
                    }
                }
            }
        ]).toArray();

        if (tutorsWithAvailability.length > 0) {
            response.status(200).json(tutorsWithAvailability);
        } else {
            response.status(404).json({ message: "No available tutors found" });
        }
    } catch (error) {
        console.error("Error fetching available tutors:", error);
        response.status(500).json({ message: "An error occurred while fetching tutors" });
    }
});

tutorAvailabilityRoutes.get("/bookings/:userId", isTutor, async (req, res) => {
    let db = database.getDb();
    const userId = req.params.userId;

    try {
        const bookings = await db.collection("bookings").find({ tutorId: userId }).sort({ date: 1 }).toArray();
        if (!bookings.length) {
            return res.status(404).json({ message: "No bookings found for this tutor" });
        }

        res.status(200).json({ bookings });
    } catch (error) {
        console.error("Error fetching tutor bookings:", error);
        res.status(500).json({ message: "Failed to fetch bookings" });
    }
});


tutorAvailabilityRoutes.patch("/Updatebooking", async (req, res) => {
    try {
        let db = database.getDb();
        const { bookingId, status } = req.body;

        // Fetch the current booking
        const currentBooking = await db.collection("bookings").findOne({ _id: new ObjectId(bookingId) });

        if (!currentBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const bookingStartTime = new Date(`${currentBooking.date}T${currentBooking.startTime}`);
        const currentTime = new Date();

        // If the current time is past the booking's start time, reject the booking
        if (currentTime > bookingStartTime) {
            // Reject the booking if time has passed
            await db.collection("bookings").updateOne(
                { _id: new ObjectId(bookingId) },
                { $set: { approvalStatus: -1 } }
            );

            let timeId = currentBooking.timeId;

            // Check if there are any other future or active bookings with the same timeId
            const otherBookings = await db.collection("bookings").find({
                timeId: timeId,
                approvalStatus: { $in: [0, 1] }, // Pending or approved bookings
                _id: { $ne: new ObjectId(bookingId) }
            }).toArray();

            if (otherBookings.length === 0) {
                // No future or active bookings with the same timeId, so generate a new UUID for the slot
                const availability = await db.collection("tutorAvailability").findOne({ "availability.slots.id": timeId });

                if (availability) {
                    const newSlotId = uuid(); // Generate new UUID for the slot

                    const updateSlotResult = await db.collection("tutorAvailability").updateOne(
                        { "availability.slots.id": timeId },
                        {
                            $set: {
                                "availability.$[].slots.$[slot].isBooked": false,
                                "availability.$[].slots.$[slot].id": newSlotId
                            }
                        },
                        { arrayFilters: [{ "slot.id": timeId }] }
                    );

                    if (updateSlotResult) {
                        // Reject other bookings with the same timeId (if any exist)
                        await db.collection("bookings").updateMany(
                            { timeId: timeId, approvalStatus: 0 },
                            { $set: { approvalStatus: -1 } }
                        );

                        return res.status(300).json({
                            message: "Booking has been rejected, slot is now available with a new ID."
                        });
                    } else {
                        return res.status(400).json({ message: "Failed to update slot availability." });
                    }
                } else {
                    return res.status(404).json({ message: "Time slot not found." });
                }
            } else {
                // If other future or active bookings exist, reject only the current booking
                await db.collection("bookings").updateOne(
                    { _id: new ObjectId(bookingId) },
                    { $set: { approvalStatus: -1 } }
                );
                return res.status(200).json({
                    message: "Booking has been rejected, but timeId remains unchanged due to future bookings."
                });
            }
        }

        // Proceed with normal booking update if the time hasn't passed
        if (currentBooking.approvalStatus === 1 || currentBooking.approvalStatus === -1) {
            return res.status(400).json({ message: "Booking has already been approved or rejected." });
        }

        // Update booking status
        const result = await db.collection("bookings").updateOne(
            { _id: new ObjectId(bookingId) },
            {
                $set: {
                    approvalStatus: status,
                    ...(status === 1 && { markAsDone: 0 }),
                },
            }
        );

        if (result) {
            let timeId = currentBooking.timeId;

            const availability = await db.collection("tutorAvailability").findOne({ "availability.slots.id": timeId });
            if (!availability) {
                return res.status(404).json({ message: "Time slot not found" });
            }

            const slots = availability.availability.flatMap(day => day.slots);
            const slot = slots.find(slot => slot.id === timeId);
            if (!slot) {
                return res.status(404).json({ message: "Slot not found" });
            }

            const updateResult = await db.collection("tutorAvailability").updateOne(
                { "availability.slots.id": timeId },
                { $set: { "availability.$[].slots.$[slot].isBooked": true } },
                { arrayFilters: [{ "slot.id": timeId }] }
            );

            if (updateResult) {
                const scheduleEntry = {
                    tutorId: currentBooking.tutorId,
                    bookingId: bookingId,
                    start: `${currentBooking.date}T${currentBooking.startTime}`,
                    end: `${currentBooking.date}T${currentBooking.endTime}`,
                    createdAt: new Date()
                };

                await db.collection("schedule").insertOne(scheduleEntry);

                const rejectResult = await db.collection("bookings").updateMany(
                    { timeId: timeId, approvalStatus: 0 },
                    { $set: { approvalStatus: -1 } }
                );

                return res.status(200).json({
                    message: "Booking status updated, slot is now booked.",
                    rejectedCount: rejectResult.modifiedCount
                });
            } else {
                return res.status(400).json({ message: "Failed to update slot booking status." });
            }
        } else {
            return res.status(400).json({ message: "Failed to update booking status." });
        }
    } catch (error) {
        console.error("Error updating booking status:", error);
        return res.status(500).json({ message: "Failed to update booking status" });
    }
});



// Route to get tutor availability/bookings for the calendar
tutorAvailabilityRoutes.get('/Calendar/:id', async (req, res) => {
    let db = database.getDb();
    const { id } = req.params;

    try {
        // Fetch events for the specific tutor from the schedule collection
        const scheduleEvents = await db.collection("schedule").find({ tutorId: id }).toArray();


        // Map events to the desired format with sequential IDs starting from 1
        const allEvents = scheduleEvents.map((event, index) => ({
            id: index + 1, // Generate sequential IDs starting from 1
            start: event.start, // Start time from the schedule event
            end: event.end      // End time from the schedule event
        }));

        res.json(allEvents); // Wrap all events in an object
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Internal server error' });
    }
});



tutorAvailabilityRoutes.patch("/markAsCompleted", async (req, res) => {
    try {
        let db = database.getDb();
        const { bookingId } = req.body;

        // Step 1: Find the current booking using bookingId
        const booking = await db.collection("bookings").findOne({ _id: new ObjectId(bookingId) });
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Step 2: Check if booking is already marked as done
        if (booking.markAsDone === 1) {
            return res.status(400).json({ message: "Booking is already marked as completed." });
        }

        // Step 3: Check if the current time is greater than the end time
        const currentTime = new Date();
        const bookingDate = new Date(booking.date); // Assuming booking.date is in a valid date format
        const endTime = new Date(`${booking.date} ${booking.endTime}`); // Assuming booking.endTime is in "HH:MM" format

        // Check if the booking date is in the future or the current time is before the end time
        if (currentTime < endTime || currentTime < bookingDate) {
            return res.status(400).json({ message: "Cannot mark as done before the end time." });
        }

        // Step 4: Fetch the tutor availability using the timeId from the booking
        const timeId = booking.timeId;
        const availability = await db.collection("tutorAvailability").findOne({ "availability.slots.id": timeId });
        if (!availability) {
            return res.status(404).json({ message: "Time slot not found in tutor availability." });
        }

        // Step 5: Mark the corresponding time slot in tutor availability as not booked
        const newSlotId = uuid(); // Generate a new UUID for the slot
        const updateAvailability = await db.collection("tutorAvailability").updateOne(
            { "availability.slots.id": timeId },
            {
                $set: {
                    "availability.$[].slots.$[slot].isBooked": false, // Mark the slot as not booked
                    "availability.$[].slots.$[slot].id": newSlotId // Assign a new ID to the slot
                }
            },
            { arrayFilters: [{ "slot.id": timeId }] }
        );

        if (!updateAvailability.matchedCount) {
            return res.status(400).json({ message: "Failed to update tutor availability." });
        }

        // Step 6: Mark the booking as done
        const updateBooking = await db.collection("bookings").updateOne(
            { _id: new ObjectId(bookingId) },
            { $set: { markAsDone: 1 } }
        );

        if (!updateBooking.modifiedCount) {
            return res.status(400).json({ message: "Failed to mark booking as completed." });
        }

        // Step 7: Respond with success message
        return res.status(200).json({ message: "Booking marked as completed, and slot is now available." });

    } catch (error) {
        console.error("Error marking booking as completed:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = tutorAvailabilityRoutes;
