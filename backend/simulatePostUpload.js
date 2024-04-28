import fs from 'fs';
import path from 'path';
import { FormData } from '@whatwg-node/fetch';
import fetch from 'node-fetch';

const backendUrl = 'https://777a044eb87f.ngrok.app/api/posts';
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjJkNmFjZTNkMjA4MGE0OTYzNGU4NWQiLCJpYXQiOjE3MTQyNzc1NzN9.kliDqKmlElZZk-RZIp4NjyGYqCC_99mECnNvDzvpPbI'; // Auth token obtained from login simulation

// Derive the directory path from import.meta.url
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const imagePath = path.join(__dirname, 'test-image.jpg'); // Replace with path to a test image

// Check if the image file exists, if not log an error and exit
if (!fs.existsSync(imagePath)) {
  console.error('Image file does not exist:', imagePath);
  process.exit(1);
}

const formData = new FormData();
formData.append('image', fs.createReadStream(imagePath), {
  filename: 'test-image.jpg',
  contentType: 'image/jpeg',
});
formData.append('caption', 'This is a test caption for post upload functionality.');

// Log FormData contents for debugging
for (const [key, value] of formData) {
  console.log(key, value);
}

// Perform the fetch to ensure proper handling of FormData
fetch(backendUrl, {
  method: 'POST',
  body: formData,
  headers: {
    'Authorization': `Bearer ${authToken}`,
  },
})
.then(response => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
})
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
