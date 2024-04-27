import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Image, Text, VStack, HStack, Button, useToast } from '@chakra-ui/react';

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Could not fetch profile:", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts/user/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Could not fetch posts:", error);
      }
    };

    fetchProfile();
    fetchPosts();
  }, [userId]);

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
