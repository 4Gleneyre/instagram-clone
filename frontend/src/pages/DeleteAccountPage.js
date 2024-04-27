import React from 'react';
import { Box, Button, Text, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const DeleteAccountPage = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      toast({
        title: 'Authentication Error',
        description: 'No authentication token found. Please log in again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('https://78e6d8ee809a.ngrok.app/api/user/deleteAccount', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      localStorage.removeItem('auth-token'); // Remove the token from local storage
      toast({
        title: 'Account Deleted',
        description: 'Your account has been successfully deleted.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/'); // Navigate to the home page after successful deletion
    } catch (error) {
      toast({
        title: 'Deletion Failed',
        description: error.toString(),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5}>
      <Text fontSize="xl" mb={4}>
        Delete Your Account
      </Text>
      <Text mb={4}>
        This action is irreversible. Once you delete your account, all of your data will be permanently removed.
      </Text>
      <Button colorScheme="red" onClick={handleDeleteAccount}>
        Delete My Account
      </Button>
    </Box>
  );
};

export default DeleteAccountPage;
