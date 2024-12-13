import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Typography } from '@mui/material';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4 }}>
        Welcome to Home Page
      </Typography>
      <Button 
        variant="contained" 
        onClick={handleLogout}
        sx={{ mt: 2 }}
      >
        Logout
      </Button>
    </Container>
  );
};

export default Home; 