import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Image, Text, VStack, HStack, Button, useToast } from '@chakra-ui/react';

console.log(`Top-level log of REACT_APP_BACKEND_URL: ${process.env.REACT_APP_BACKEND_URL}`);

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  console.log(`User ID from URL params: ${userId}`);

  useEffect(() => {
    console.log('useEffect hook executed for ProfilePage component'); // Log when useEffect is executed
    console.log(`Backend URL from environment: ${process.env.REACT_APP_BACKEND_URL}`);

    if (!process.env.REACT_APP_BACKEND_URL) {
      console.error('REACT_APP_BACKEND_URL is not set');
      setError('Backend URL is not set. Please check the environment variables.');
    } else {
      const fetchProfile = async () => {
        try {
          console.log(`Fetching profile for user ID: ${userId}`);
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/${userId}`, {
            headers: {
              'Content-Type': 'application/json',
              'auth-token': localStorage.getItem('auth-token')
            }
          });
          console.log('Full response for profile:', response);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log('Profile data received:', data);
          setProfile(data);
          console.log('Profile state updated with fetched data'); // Log after profile state is set
        } catch (error) {
          console.error("Could not fetch profile:", error);
          setError(error.toString());
          toast({
            title: 'Error fetching profile.',
            description: error.toString(),
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        }
      };

      const fetchPosts = async () => {
        try {
          console.log(`Fetching posts for user ID: ${userId}`);
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts/user/${userId}`, {
            headers: {
              'Content-Type': 'application/json',
              'auth-token': localStorage.getItem('auth-token')
            }
          });
          console.log('Full response for posts:', response);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log('Posts data received:', data);
          setPosts(data);
          console.log('Posts state updated with fetched data'); // Log after posts state is set
        } catch (error) {
          console.error("Could not fetch posts:", error);
          toast({
            title: 'Error fetching posts.',
            description: error.toString(),
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        }
      };

      fetchProfile();
      fetchPosts();
    }
  }, [userId, toast]);

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('auth-token')
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        toast({
          title: 'Account deleted.',
          description: "Your account has been successfully deleted.",
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        navigate('/');
      } catch (error) {
        console.error("Could not delete account:", error);
        toast({
          title: 'Error.',
          description: "There was an error deleting your account.",
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  // Debugging: Log the profile and posts state
  console.log('Profile state:', profile);
  console.log('Posts state:', posts);

  if (!process.env.REACT_APP_BACKEND_URL || !userId) {
    return (
      <Box>
        <Text>Error: Missing backend URL or user ID.</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Text>Error: {error}</Text>
      </Box>
    );
  }

  if (!profile) {
    return <Box>Loading...</Box>;
  }

  return (
    <VStack spacing={4}>
      <Image borderRadius="full" boxSize="150px" src={profile.image} alt={profile.username} />
      <Text fontSize="2xl">{profile.username}</Text>
      <HStack spacing={4}>
        <VStack>
          <Text fontSize="xl">{profile.posts.length}</Text>
          <Text fontSize="md">Posts</Text>
        </VStack>
        <VStack>
          <Text fontSize="xl">{profile.followers.length}</Text>
          <Text fontSize="md">Followers</Text>
        </VStack>
        <VStack>
          <Text fontSize="xl">{profile.following.length}</Text>
          <Text fontSize="md">Following</Text>
        </VStack>
      </HStack>
      <Button colorScheme="blue">Follow</Button>
      {/* Add a button to delete the user's account */}
      <Button colorScheme="red" onClick={handleDeleteAccount}>Delete Account</Button>
      <Box>
        {posts.map((post) => (
          <Box key={post._id} p={5} shadow="md" borderWidth="1px">
            <Image src={post.image} alt={`Post by ${profile.username}`} />
            <Text mt={4}>{post.caption}</Text>
          </Box>
        ))}
      </Box>
    </VStack>
  );
};

export default ProfilePage;
