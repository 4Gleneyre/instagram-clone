const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const backendUrl = 'https://777a044eb87f.ngrok.app/api/posts';
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjJkNmFjZTNkMjA4MGE0OTYzNGU4NWQiLCJpYXQiOjE3MTQyNzAzMTh9.uqKffzbYQV7NWnrjE0SyxFgqW1a7IsK5lIilz0E2eiw'; // Auth token obtained from login simulation

const imagePath = path.join(__dirname, 'test-image.jpg'); // Replace with path to a test image

// Create a test image file to simulate upload
fs.writeFileSync(imagePath, 'Test image content');

const formData = new FormData();
formData.append('image', fs.createReadStream(imagePath), {
  filename: 'test-image.jpg',
  contentType: 'image/jpeg',
});
formData.append('caption', 'This is a test caption for post upload functionality.');

const options = {
  method: 'POST',
  body: formData,
  headers: {
    'auth-token': authToken,
    // FormData will calculate the Content-Length for us
  },
};

// Remove the Content-Type header so that fetch can set it with the correct boundary
delete options.headers['Content-Type'];

fetch(backendUrl, options)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));