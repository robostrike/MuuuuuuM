import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './App.tsx'
import { auth } from './firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';

function handleGoogleLogin() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log('User ID:', user.uid); // Unique user ID
      console.log('User Name:', user.displayName);
    })
    .catch((error) => {
      console.error('Error during login:', error);
    });
}

function handleSignOut() {
  signOut(auth)
    .then(() => {
      console.log('User signed out successfully.');
    })
    .catch((error) => {
      console.error('Error during sign out:', error);
    });
}

function AppWithGoogleLogin() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email); // Set user email if signed in
      } else {
        setUserEmail(null); // Clear user email if signed out
      }
    });
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return (
    <>
      <App />
      {userEmail ? (
        <>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <button onClick={handleGoogleLogin}>Login with Google</button>
      )}
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithGoogleLogin />
  </StrictMode>,
);