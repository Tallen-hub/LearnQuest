import React, { useState } from 'react';
import {
  Box,
  Stack,
  Input,
  Button,
  Checkbox,
  CheckboxGroup,
  Textarea,
  useToast,
  Collapse,
  FormControl,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../api'; 

const subjectsOptions = [
  "Math",
  "Science",
  "English",
  "History",
  "Computer Science",
];

const specificSubjects = {
  Math: ["Algebra", "Geometry", "Calculus"],
  Science: ["Biology", "Chemistry", "Physics"],
  English: ["Literature", "Grammar", "Writing"],
  History: ["World History", "American History"],
  "Computer Science": ["Programming", "Data Structures", "Web Development"],
};

const TutorSignUpForm = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    subjects: [],
    specificSubjects: [],
    bio: '',
    experience: '',
  });
  
  const toast = useToast();
  const navigate = useNavigate();
  const [isSubjectsOpen, setIsSubjectsOpen] = useState(false);
  const [isSpecificSubjectsOpen, setIsSpecificSubjectsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    
    // Validation checks...
    if (user.password !== user.confirmPassword) {
      setLoading(false);
      return;
    }

    try {
      const response = await createUser({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        password: user.password,
        role: 'tutor',
        subjects: user.subjects,
        specificSubjects: user.specificSubjects,
        bio: user.bio,
        experience: user.experience,
      });

      if (response.status === 200) {
        const userData = response.data; 
        
        // Clear form and show success
        setUser({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          subjects: [],
          specificSubjects: [],
          bio: '',
          experience: '',
        });
        
        toast({
          title: 'Success',
          description: 'Tutor signed up successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Navigate using the returned user ID from MongoDB
        navigate(`/tutor-home/${userData.insertedId}`);
      } else {
        throw new Error('Sign-up failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'An error occurred during sign-up',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box as={'form'} mt={1}>
      <Stack spacing={4}>
        <Input
          placeholder="First Name"
          value={user.firstName}
          onChange={(e) => setUser({ ...user, firstName: e.target.value })}
        />
        <Input
          placeholder="Last Name"
          value={user.lastName}
          onChange={(e) => setUser({ ...user, lastName: e.target.value })}
        />
        <Input
          placeholder="Email"
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <Input
          placeholder="Password"
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <Input
          placeholder="Confirm Password"
          type="password"
          value={user.confirmPassword}
          onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
        />
        {/* Area of Expertise Dropdown */}
        <FormControl>
          <Button 
            onClick={() => setIsSubjectsOpen(!isSubjectsOpen)} 
            w={'full'}
          >
            {user.subjects.length > 0 ? `Area of Expertise: ${user.subjects.join(', ')}` : 'Area of Expertise'}
          </Button>
          <Collapse in={isSubjectsOpen}>
            <CheckboxGroup 
              colorScheme="pink" 
              value={user.subjects}
              onChange={(value) => {
                setUser({ ...user, subjects: value, specificSubjects: [] });
                setIsSpecificSubjectsOpen(false);
              }}
            >
              <Stack spacing={2} mt={2}>
                {subjectsOptions.map((subject) => (
                  <Checkbox key={subject} value={subject}>
                    {subject}
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
          </Collapse>
        </FormControl>
        {/* Specific Subjects Dropdown */}
        {user.subjects.length > 0 && (
          <FormControl>
            <Button 
              onClick={() => setIsSpecificSubjectsOpen(!isSpecificSubjectsOpen)} 
              w={'full'}
              mt={2}
            >
              {user.specificSubjects.length > 0 ? `Specific Subjects: ${user.specificSubjects.join(', ')}` : 'Select Specific Subjects'}
            </Button>
            <Collapse in={isSpecificSubjectsOpen}>
              <CheckboxGroup 
                colorScheme="pink" 
                value={user.specificSubjects}
                onChange={(value) => setUser({ ...user, specificSubjects: value })}
              >
                <Stack spacing={2} mt={2}>
                  {user.subjects.flatMap(subject => 
                    specificSubjects[subject] ? specificSubjects[subject].map(specific => (
                      <Checkbox key={specific} value={specific}>
                        {specific}
                      </Checkbox>
                    )) : []
                  )}
                </Stack>
              </CheckboxGroup>
            </Collapse>
          </FormControl>
        )}
        <Textarea
          placeholder="Bio/Introduction"
          value={user.bio}
          onChange={(e) => setUser({ ...user, bio: e.target.value })}
        />
        <Textarea
          placeholder="Experience (optional)"
          value={user.experience}
          onChange={(e) => setUser({ ...user, experience: e.target.value })}
        />
      </Stack>
      <Button
        fontFamily={'heading'}
        mt={8}
        w={'full'}
        bgGradient="linear(to-r, red.400,pink.400)"
        color={'white'}
        onClick={handleSignUp}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </Box>
  );
};

export default TutorSignUpForm;
