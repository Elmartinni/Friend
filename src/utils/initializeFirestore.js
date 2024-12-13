import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export const createChat = async (user1Id, user2Id) => {
  try {
    const chatRef = await addDoc(collection(db, 'chats'), {
      participants: [user1Id, user2Id],
      createdAt: new Date(),
      lastMessage: '',
      lastMessageTime: new Date()
    });
    return chatRef.id;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

export const createUserProfile = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: new Date(),
      chats: []
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}; 