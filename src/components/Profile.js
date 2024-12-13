import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  Container,
  Paper,
  IconButton,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState({
    displayName: '',
    bio: '',
    phoneNumber: '',
    location: '',
    interests: '',
    profilePicture: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch existing profile data
    const fetchProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setProfile(prevProfile => ({
            ...prevProfile,
            ...userDoc.data()
          }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile');
      }
    };

    if (auth.currentUser) {
      fetchProfile();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      setProfile(prevProfile => ({
        ...prevProfile,
        profilePicture: downloadURL
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        ...profile,
        updatedAt: new Date(),
      }, { merge: true });

      navigate('/dashboard'); // or wherever you want to redirect after saving
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Profile Settings
        </Typography>

        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={profile.profilePicture}
                sx={{ width: 100, height: 100 }}
              />
              <input
                accept="image/*"
                type="file"
                id="icon-button-file"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="icon-button-file">
                <IconButton
                  component="span"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'white'
                  }}
                >
                  <PhotoCamera />
                </IconButton>
              </label>
            </Box>
          </Box>

          <TextField
            margin="normal"
            fullWidth
            label="Display Name"
            name="displayName"
            value={profile.displayName}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Bio"
            name="bio"
            multiline
            rows={3}
            value={profile.bio}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={profile.phoneNumber}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Location"
            name="location"
            value={profile.location}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Interests (comma separated)"
            name="interests"
            value={profile.interests}
            onChange={handleChange}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 