import { verifyUser } from "../../api";
import React, { useState } from "react";
import {
  Box,
  Stack,
  Heading,
  Text,
  Input,
  Button,
  Checkbox,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import TutorSignUpForm from "./TutorSignUpForm";
import StudentSignUpForm from "./StudentSignUpForm";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true); // Track whether user is logging in or signing up
  const [role, setRole] = useState(""); // Track user role (student or tutor)
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmPassword: "", // Added for sign-up validation
  });
  const toast = useToast();
  const navigate = useNavigate();

  const handleAuth = async () => {
    // Validation checks
    if (!user.email || !user.password || (!isLogin && !user.confirmPassword)) {
      toast({
        title: "Error",
        description: "Please fill all the required fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    // Validate email format
    if (!user.email.includes("@")) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    // Authentication logic
    try {
      const userData = await verifyUser({
        email: user.email,
        password: user.password,
      });
  
      // Redirect based on user role
      if (userData.role === "student") {
        navigate(`/student-home/${userData._id}`);
      } else {
        navigate(`/tutor-home/${userData._id}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Authentication failed. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  

  return (
    <Stack>
      <Heading
        color={"gray.800"}
        lineHeight={1.1}
        fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
      >
        {isLogin
          ? "Log In"
          : role
          ? `Create a ${role.charAt(0).toUpperCase() + role.slice(1)} Account`
          : "Create an Account"}
        <Text
          as={"span"}
          bgGradient="linear(to-r, red.400,pink.400)"
          bgClip="text"
        >
          !
        </Text>
      </Heading>
      <Text color={"gray.500"} fontSize={{ base: "sm", sm: "md" }}>
        {isLogin ? "We’re glad to see you again!" : "Join our amazing team!"}
      </Text>

      <Box as={"form"} mt={10}>
        <Stack spacing={4}>
          {isLogin && (
            <>
              <Box>
                <Text fontWeight="bold">Email</Text>
                <Input
                  placeholder="janedoe@gmail.com"
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  type="email"
                  value={user.email}
                  onChange={(e) =>
                    setUser({ ...user, email: e.target.value })
                  }
                  _placeholder={{
                    color: "gray.500",
                  }}
                />
              </Box>

              <Box>
                <Text fontWeight="bold">Password</Text>
                <Input
                  placeholder="Password"
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  type="password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  _placeholder={{
                    color: "gray.500",
                  }}
                />
              </Box>

              <Box>
                <Checkbox colorScheme="pink">Remember me</Checkbox>
                <Box
                  as="span"
                  ml={4}
                  fontSize="sm"
                  textDecoration="underline"
                  cursor="pointer"
                >
                  Forgot your password?
                  
                </Box>
              </Box>
            </>
          )}

          {/* Conditionally render the sign-up forms based on role */}
          {!isLogin && role === "student" && (
            <Box mt={4}>
              <StudentSignUpForm />
            </Box>
          )}
          {!isLogin && role === "tutor" && (
            <Box mt={4}>
              <TutorSignUpForm />
            </Box>
          )}
        </Stack>

        {/* Log In and Sign Up buttons */}
        {isLogin && (
          <Button
            fontFamily={"heading"}
            mt={8}
            mb={4}
            w={"full"}
            bgGradient="linear(to-r, red.400,pink.400)"
            color={"white"}
            onClick={handleAuth}
          >
            Log In
          </Button>
        )}
      </Box>

      {/* Bottom Links */}
      <Box>
        {isLogin ? (
          <>
            <Box
              as="span"
              cursor="pointer"
              onClick={() => {
                setIsLogin(false);
                setRole("student");
              }}
              textDecoration="underline"
            >
              Sign up as a student
            </Box>
            {" or "}
            <Box
              as="span"
              cursor="pointer"
              onClick={() => {
                setIsLogin(false);
                setRole("tutor");
              }}
              textDecoration="underline"
            >
              Sign up as a tutor
            </Box>
          </>
        ) : (
          <Box
            as="span"
            cursor="pointer"
            onClick={() => {
              setIsLogin(true);
              setRole("");
            }}
            textDecoration="underline"
          >
            Already have an account? Log in
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default AuthForm;
