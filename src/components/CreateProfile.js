import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  Container,
  Paper,
  IconButton,
  CircularProgress
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const CreateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    displayName: '',
    bio: '',
    phoneNumber: '',
    location: '',
    profilePicture: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
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
      
      setProfileData(prev => ({
        ...prev,
        profilePicture: downloadURL
      }));
    } catch (error) {
      setError('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.displayName.trim()) {
      setError('Display name is required');
      return;
    }

    setLoading(true);
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        ...profileData,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: auth.currentUser.uid,
        email: auth.currentUser.email
      });

      navigate('/dashboard'); // Navigate to main dashboard after profile creation
    } catch (error) {
      setError('Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Create Your Profile
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 3 }}>
          Please complete your profile to continue
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
                src={profileData.profilePicture}
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
            required
            fullWidth
            label="Display Name"
            name="displayName"
            value={profileData.displayName}
            onChange={handleChange}
            autoFocus
          />

          <TextField
            margin="normal"
            fullWidth
            label="Bio"
            name="bio"
            multiline
            rows={3}
            value={profileData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
          />

          <TextField
            margin="normal"
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={profileData.phoneNumber}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Location"
            name="location"
            value={profileData.location}
            onChange={handleChange}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Profile'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateProfile; 