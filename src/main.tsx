import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './App.tsx'
import { auth } from './firebaseConfig';
import { useEffect, useState } from 'react';

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      setAuthInitialized(true); // Ensure auth state is initialized
    });
    return () => unsubscribe();
  }, []);

  if (!authInitialized) {
    return <div>Loading...</div>; // Show a loading state until auth is initialized
  }

  return <>{children}</>;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthWrapper>
      <App />
    </AuthWrapper>
  </StrictMode>,
);