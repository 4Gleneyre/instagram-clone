import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Textarea, useToast } from '@chakra-ui/react';

const UploadPostPage = () => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const toast = useToast();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: 'No image selected',
        description: "Please select an image to upload.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('caption', caption);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'auth-token': localStorage.getItem('auth-token'),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json(); // Removed the unused variable 'data'
      toast({
        title: 'Post Uploaded',
        description: "Your post has been successfully uploaded.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      // Reset form
      setFile(null);
      setCaption('');
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={8}>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Image</FormLabel>
          <Input type="file" onChange={handleFileChange} />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Caption</FormLabel>
          <Textarea value={caption} onChange={handleCaptionChange} placeholder="What's on your mind?" />
        </FormControl>
        <Button mt={4} colorScheme="blue" type="submit">Upload Post</Button>
      </form>
    </Box>
  );
};

export default UploadPostPage;
