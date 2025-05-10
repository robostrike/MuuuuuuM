import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Theme from './theme';
import Header from './pages/Header';
import SinglePage from './pages/SinglePage';
import HomePage from './pages/HomePage';
import { auth } from './firebaseConfig'; // Firebase auth instance
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://pzyryihuzjablnicmcza.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eXJ5aWh1emphYmxuaWNtY3phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MjA4MTcsImV4cCI6MjA1ODk5NjgxN30.LaF7yVNw-u6lno1cc0tjEuS9pkOID1LD1PEMJjVJaQM';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const App: React.FC = () => {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const firebaseUid = user.uid;

        try {
          // Check if the user already exists in Supabase
          const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('firebase_user_id', firebaseUid)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            // Log error if it's not a "no rows found" error
            console.error('Error fetching profile:', fetchError);
            return;
          }

          if (!existingProfile) {
            // Create a new profile in Supabase
            const { error: profileError } = await supabase
              .from('profiles')
              .insert([{ firebase_user_id: firebaseUid, email: user.email }]);

            if (profileError) {
              console.error('Error inserting profile:', profileError);
            } else {
              console.log('Profile created successfully in Supabase.');
            }
          } else {
            console.log('User already exists in Supabase.');
          }

          // Set the Firebase token in Supabase for RLS
          const token = await user.getIdToken();
          await supabase.auth.signInWithIdToken({ provider: 'firebase', token });
        } catch (error) {
          console.error('Error during Firebase-Supabase sync:', error);
        }
      } else {
        // Clear Supabase auth if the user logs out
        await supabase.auth.signOut();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider theme={Theme}>
      <BrowserRouter basename="/MuuuuuuM">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/single" element={<SinglePage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;