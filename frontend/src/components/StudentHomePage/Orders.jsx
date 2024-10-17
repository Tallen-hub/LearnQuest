import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
  Heading,
  Stack,
  Badge,
} from "@chakra-ui/react";
import { fetchUserBookings } from "../../api";

const Orders = () => {
  const { id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const data = await fetchUserBookings(id);
        setBookings(data.bookings);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    getBookings();
  }, [id]);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error" mt={4}>
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box maxW="4xl" mx="auto" mt={8} p={4}>
      <Heading as="h2" size="lg" mb={6} textAlign="center" color="teal.500">
        Your Bookings
      </Heading>
      {bookings.length > 0 ? (
        <Stack spacing={6}>
          {bookings.map((booking) => (
            <Box
              key={booking._id}
              p={6}
              boxShadow="lg"
              borderRadius="lg"
              bg="white"
              _hover={{ bg: "gray.50", transform: "scale(1.02)", transition: "0.3s" }}
              border="1px"
              borderColor="gray.200"
            >
              <Flex justify="space-between" align="center" mb={4}>
                <Text fontSize="lg" fontWeight="bold" color="teal.600">
                  {booking.Tutor}
                </Text>
                <Badge
                  colorScheme={
                    booking.approvalStatus === 1
                      ? "green"
                      : booking.approvalStatus === -1
                        ? "red"
                        : "yellow"
                  }
                  fontSize="md"
                  px={4}
                  py={1}
                  borderRadius="md"
                >
                  {booking.approvalStatus === 0
                    ? "Pending"
                    : booking.approvalStatus === 1
                      ? "Approved"
                      : "Rejected"}
                </Badge>
              </Flex>

              <Text fontSize="md" color="gray.700">
                <strong>Day:</strong> {booking.day}
              </Text>
              <Text fontSize="md" color="gray.700" mt={2}>
                <strong>Time:</strong> {booking.startTime} - {booking.endTime}
              </Text>
              <Text fontSize="md" color="gray.700" mt={2}>
                <strong>Time:</strong> {booking.date}
              </Text>
              {
                booking.markAsDone ?
                  <Badge colorScheme="green" p={2} borderRadius="lg">
                    Completed
                  </Badge> : ""
              }
            </Box>
          ))}
        </Stack>
      ) : (
        <Alert status="info" mt={4}>
          <AlertIcon />
          No bookings found for you.
        </Alert>
      )}
    </Box>
  );
};

export default Orders;
