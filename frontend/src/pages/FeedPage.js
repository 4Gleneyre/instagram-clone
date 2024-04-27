import React, { useState, useEffect } from 'react';
import { Box, VStack, Image, Text } from '@chakra-ui/react';

const FeedPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('Fetching posts...');
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts/feed`, {
          headers: {
            'auth-token': localStorage.getItem('auth-token'),
          },
        });
        console.log('Response received:', response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Data received:', data);
        setPosts(data);
      } catch (error) {
        console.error("Could not fetch feed:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <VStack spacing={8}>
      {posts.length > 0 ? (
        posts.map((post) => (
          <Box key={post._id} p={5} shadow="md" borderWidth="1px">
            <Image src={post.image} alt={`Post by ${post.user.username}`} />
            <Text mt={4}>{post.caption}</Text>
          </Box>
        ))
      ) : (
        <Text>No posts to display</Text>
      )}
    </VStack>
  );
};

export default FeedPage;
