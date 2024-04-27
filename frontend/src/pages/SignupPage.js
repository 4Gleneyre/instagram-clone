import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      toast({
        title: 'Account Created',
        description: data.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Signup Failed',
        description: error.toString(),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
      <form onSubmit={handleSignup}>
        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired mt={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired mt={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button width="full" mt={4} type="submit">
          Sign Up
        </Button>
      </form>
    </Box>
  );
};

export default SignupPage;
