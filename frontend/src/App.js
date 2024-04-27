import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import FeedPage from './pages/FeedPage';
import UploadPostPage from './pages/UploadPostPage';
import DeleteAccountPage from './pages/DeleteAccountPage';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/upload" element={<UploadPostPage />} />
          <Route path="/account/delete" element={<DeleteAccountPage />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
