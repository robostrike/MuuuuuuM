import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './App.tsx'
import { auth } from './firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

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

function AppWithGoogleLogin() {
  return (
    <>
      <App />
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithGoogleLogin />
  </StrictMode>,
);
