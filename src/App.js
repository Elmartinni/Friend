import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FirebaseProvider, useFirebase } from './contexts/FirebaseContext';
import Login from './components/Login';
import SignUp from './components/SignUp';
import CreateProfile from './components/CreateProfile';
import ChatDashboard from './components/ChatDashboard';

function App() {
  return (
    <FirebaseProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route 
            path="/create-profile" 
            element={
              <PrivateRoute>
                <CreateProfile />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <ChatDashboard />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </FirebaseProvider>
  );
}

const PrivateRoute = ({ children }) => {
  const { user } = useFirebase();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default App;
