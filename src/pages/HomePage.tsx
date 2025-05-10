import { useEffect, useState } from 'react';
import { Button, Box, CardContent, Typography, Alert } from '@mui/material';
import ContainedPage from './containedPage';
import fullList from '../content/hear_speak.json';
import confirmConfidence from '../content/confirmConfidence.json';
import { auth } from '../firebaseConfig';
import { supabase } from '../utils/supabase';
import { v4 as uuidv4 } from 'uuid';
import axes from '../content/axes.json';

const HomePage = () => {
  const [positions, setPositions] = useState<{ id: number; x: number; y: number }[]>([]);
  const [displayPositions, setDisplayPositions] = useState<{ id: number; x: number; y: number }[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [contentQueue, setContentQueue] = useState(confirmConfidence);
  const [selectedAxisId, setSelectedAxisId] = useState(1); // Default to the first axis
  const [selectedAxis] = useState(axes[selectedAxisId]); // Default to the first axis
  const today = new Date();
  const baseDate = new Date('2020-11-28');
  const daysDifference = Math.floor((today.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const currentIndex = daysDifference % confirmConfidence.length;
  const [currentContent, setCurrentContent] = useState(confirmConfidence[currentIndex] || null);

  const [saveInProgress, setSaveInProgress] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedInUser(user.uid);
      } else {
        setLoggedInUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let existingSessionId = localStorage.getItem('homepage_session_id');
    if (!existingSessionId) {
      existingSessionId = uuidv4();
      localStorage.setItem('homepage_session_id', existingSessionId);
    }
    setSessionId(existingSessionId);
  }, []);

  const handlePositionsUpdate = (updatedPositions: { id: number; x: number; y: number }[]) => {
      setPositions(updatedPositions); // Update positions in HomePage
    };


  const handleSaveMarker = async () => {
    if (displayPositions.length !== 2) return; // Ensure two positions are set

    const [hearPosition, speakPosition] = displayPositions;

    try {
      setSaveInProgress(true);
      setDbError(null);

      const { data, error } = await supabase
        .from('daily_list')
        .insert([{
          user_ID: loggedInUser,
          word_phrase: currentContent,
          posX_hear: hearPosition.x,
          posY_hear: hearPosition.y,
          posX_speak: speakPosition.x,
          posY_speak: speakPosition.y,
          metadata: { browser_info: navigator.userAgent },
          axis_left: selectedAxis.left,
          axis_right: selectedAxis.right,
          axis_up: selectedAxis.up,
          axis_down: selectedAxis.down,
        }]);

      if (error) {
        console.error('Supabase error saving response:', error);
        setDbError(`Database error: ${error.message}`);
        return;
      }

      console.log('Response saved to database:', data);

      // Move to the next content
      const newQueue = contentQueue.slice(1);
      setContentQueue(newQueue);
      setCurrentContent(newQueue[0] || null);
      setPositions([]);
      setDisplayPositions([]);
    } catch (err) {
      console.error('Error saving to database:', err);
      setDbError(err instanceof Error ? err.message : 'Failed to save response');
    } finally {
      setSaveInProgress(false);
    }
  };

  const handleReset = () => {
    setPositions([]);
    setContentQueue(confirmConfidence);
    setCurrentContent(confirmConfidence[0] || null);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        overflow: 'auto',
        position: 'relative',
        paddingTop: '64px',
      }}
    >
      {/* Word of the Day Section */}
      <Box
        style={{
          backgroundColor: 'white',
          marginTop: 20,
          marginBottom: 10,
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
          minHeight: 175,
          zIndex: 2,
          position: 'relative',
        }}
      >
        <CardContent>
          <Typography variant="body1" component="div" gutterBottom sx={{ textAlign: 'left' }}>
            Current Item
          </Typography>
          <Typography variant="h1" component="p" fontWeight="bold">
            {currentContent || 'No Content'}
          </Typography>
          <Typography variant="body2" component="p" sx={{ textAlign: 'left' }}>
            Drag the buttons to a position that best represents when hearing someone use the word (left) versus your intention (right).
          </Typography>
        </CardContent>
      </Box>

      <ContainedPage 
      items={fullList} 
      onPositionsUpdate={handlePositionsUpdate} 
      onDisplayPositionsUpdate={setDisplayPositions}
      axes={axes.find(axis => axis.id === selectedAxisId)} // Pass the selected axis
      />

      {dbError && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {dbError}
        </Alert>
      )}

      <div
        style={{
          marginTop: 20,
          display: 'flex',
          flexDirection: 'row',
          gap: '10px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveMarker}
          disabled={positions.length !== 2 || saveInProgress}
        >
          {saveInProgress ? 'Saving...' : 'Save'}
        </Button>
        <Button variant="outlined" color="primary" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
