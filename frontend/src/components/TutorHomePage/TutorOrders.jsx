import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Text,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
  Stack,
  Heading,
  Divider,
  Badge,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { fetchTutorBookings, markAsCompleted, updateBookingStatus } from "../../api"; // Assuming your api.js is in src/api

const TutorOrders = () => {
  const { id } = useParams(); // The tutor's ID
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const cancelRef = useRef();

  useEffect(() => {
    // Function to fetch tutor bookings
    const getBookings = async () => {
      try {
        const data = await fetchTutorBookings(id);
        setBookings(data.bookings || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    // Fetch bookings initially
    getBookings();

    // Polling: Re-fetch bookings every 10 seconds to keep the data fresh
    const intervalId = setInterval(getBookings, 10000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [id]);

  const handleUpdateStatus = async (bookingId, status) => {
    setUpdating(true);
    try {
      // Optimistically update the UI
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? { ...booking, approvalStatus: status } : booking
        )
      );

      // Make the API call to update the booking status
      await updateBookingStatus(bookingId, status);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
      // Rollback the UI change if the API call fails
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? { ...booking, approvalStatus: 0 } : booking
        )
      );
    } finally {
      setUpdating(false);
    }
  };

  const openConfirmationDialog = (bookingId) => {
    setSelectedBookingId(bookingId);
    setIsDialogOpen(true);
  };

  const handleMarkAsDone = async () => {
    setUpdating(true);
    try {
      // Optimistically mark the booking as done in the UI
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === selectedBookingId ? { ...booking, markAsDone: 1 } : booking
        )
      );

      // Make the API call to mark the booking as done
      await markAsCompleted(selectedBookingId);
      console.log("Marked as done:", selectedBookingId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark as done");
      // Rollback the UI change if the API call fails
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === selectedBookingId ? { ...booking, markAsDone: 0 } : booking
        )
      );
    } finally {
      setUpdating(false);
      setIsDialogOpen(false); // Close the dialog
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="80vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error" maxW="md" mx="auto" mt={6}>
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box maxW="4xl" mx="auto" p={6}>
      <Heading mb={6} textAlign="center" size="lg">
        Tutor Bookings
      </Heading>
      {bookings && bookings.length > 0 ? (
        <Stack spacing={6}>
          {bookings.map((booking) => (
            <Box
              key={booking._id}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="md"
              p={6}
              background="gray.50"
            >
              <Flex justify="space-between" align="center">
                <Heading size="md">{booking.Name}</Heading>
                <Badge
                  colorScheme={
                    booking.approvalStatus === 0
                      ? "yellow"
                      : booking.approvalStatus === 1
                        ? "green"
                        : "red"
                  }
                  p={2}
                  borderRadius="lg"
                >
                  {booking.approvalStatus === 0
                    ? "Pending"
                    : booking.approvalStatus === 1
                      ? "Approved"
                      : "Rejected"}
                </Badge>
              </Flex>
              <Divider my={4} />
              <Text>
                <strong>Day:</strong> {booking.day}
              </Text>
              <Text>
                <strong>Date:</strong> {booking.date}
              </Text>
              <Text>
                <strong>Time:</strong> {booking.startTime} - {booking.endTime}
              </Text>
              <Flex justify="flex-end" mt={4} gap={4}>
                {booking.approvalStatus === 0 && (
                  <>
                    <Button
                      colorScheme="green"
                      isLoading={updating}
                      onClick={() => handleUpdateStatus(booking._id, 1)}
                      size="sm"
                    >
                      Approve
                    </Button>
                    <Button
                      colorScheme="red"
                      isLoading={updating}
                      onClick={() => handleUpdateStatus(booking._id, -1)}
                      size="sm"
                    >
                      Reject
                    </Button>
                  </>
                )}
                {booking.approvalStatus === 1 && (
                  <>
                    {booking.markAsDone === 0 ? (
                      <Button
                        colorScheme="blue"
                        size="sm"
                        onClick={() => openConfirmationDialog(booking._id)}
                      >
                        Mark as Done
                      </Button>
                    ) : (
                      <Badge colorScheme="green" p={2} borderRadius="lg">
                        Completed
                      </Badge>
                    )}
                  </>
                )}
              </Flex>
            </Box>
          ))}
        </Stack>
      ) : (
        <Alert status="info" maxW="md" mx="auto" mt={6}>
          <AlertIcon />
          No bookings found for this tutor.
        </Alert>
      )}

      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Mark as Done
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure you want to mark this booking as completed?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDialogOpen(false)}>
                No
              </Button>
              <Button colorScheme="blue" onClick={handleMarkAsDone} ml={3} isLoading={updating}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default TutorOrders;
