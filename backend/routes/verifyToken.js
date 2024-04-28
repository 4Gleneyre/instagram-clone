import jwt from 'jsonwebtoken';

export default function(req, res, next) {
  // Check for the token in the 'Authorization' header and extract it if present
  const authHeader = req.header('Authorization');
  console.log('Authorization header:', authHeader); // Additional logging to check the Authorization header
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token after 'Bearer'

  console.log('Verifying token:', token);

  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log('Token verified:', verified);
    req.user = verified;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(400).send('Invalid Token');
  }
};
