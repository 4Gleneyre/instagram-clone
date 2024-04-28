const backendUrl = 'https://777a044eb87f.ngrok.app/api/user/login';
const credentials = {
  email: 'jayfu03@gmail.com',
  password: 'hello123'
};

const options = {
  method: 'POST',
  body: JSON.stringify(credentials),
  headers: {
    'Content-Type': 'application/json'
  },
};

import('node-fetch').then(({ default: fetch }) => {
  fetch(backendUrl, options)
    .then(response => {
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
      } else {
        return response.text();
      }
    })
    .then(text => {
      console.log('Raw response:', text);
    })
    .catch(error => console.error('Error:', error));
});
