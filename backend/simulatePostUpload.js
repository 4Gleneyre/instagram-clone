const fs = require('fs');
const path = require('path');
const { FormData, fetch } = require('node-fetch');

const backendUrl = 'https://777a044eb87f.ngrok.app/api/posts';
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjJkNmFjZTNkMjA4MGE0OTYzNGU4NWQiLCJpYXQiOjE3MTQyNzAzMTh9.uqKffzbYQV7NWnrjE0SyxFgqW1a7IsK5lIilz0E2eiw'; // Auth token obtained from login simulation

const imagePath = path.join(__dirname, 'test-image.jpg'); // Replace with path to a test image

// Check if the image file exists, if not log an error
if (!fs.existsSync(imagePath)) {
  console.error('Image file does not exist:', imagePath);
  return;
}

const formData = new FormData();
formData.append('image', fs.createReadStream(imagePath), {
  filename: 'test-image.jpg',
  contentType: 'image/jpeg',
});
formData.append('caption', 'This is a test caption for post upload functionality.');

// Set headers for multipart/form-data
const options = {
  method: 'POST',
  body: formData,
  headers: {
    'auth-token': authToken,
    // 'Content-Type': 'multipart/form-data' is set automatically by fetch when using FormData
  },
};

fetch(backendUrl, options)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
