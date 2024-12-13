import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import ChatSidebar from './ChatSidebar';
import ChatMain from './ChatMain';

const ChatDashboard = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <Box sx={{ height: '100vh', display: 'flex' }}>
      <Grid container>
        <Grid item xs={3}>
          <ChatSidebar onChatSelect={setSelectedChat} />
        </Grid>
        <Grid item xs={9}>
          <ChatMain selectedChat={selectedChat} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChatDashboard; 