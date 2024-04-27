import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Image, Text, VStack, HStack, Button } from '@chakra-ui/react';

const ProfilePage = () => {
  const { userId } = useParams();
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
