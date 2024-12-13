import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  InputAdornment,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const ChatSidebar = ({ onChatSelect }) => {
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch chats from Firebase
    const q = query(collection(db, 'chats'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChats(chatList);
    });

    return () => unsubscribe();
  }, []);

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ height: '100vh', borderRight: 1, borderColor: 'divider' }}>
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search chats"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Divider />
      <List sx={{ overflow: 'auto', maxHeight: 'calc(100vh - 80px)' }}>
        {filteredChats.map((chat) => (
          <ListItem
            key={chat.id}
            button
            onClick={() => onChatSelect(chat)}
          >
            <ListItemAvatar>
              <Avatar src={chat.avatar} alt={chat.name}>
                {chat.name[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={chat.name}
              secondary={chat.lastMessage}
              secondaryTypographyProps={{
                noWrap: true,
                sx: { color: 'text.secondary' }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ChatSidebar; 