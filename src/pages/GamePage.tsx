import { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Alert, Paper } from '@mui/material';
import MarkerGrid from '../components/MarkerGrid';
import ContentDisplay from '../components/ContentDisplay';
import { ThemeProvider } from '@mui/material/styles';
import Theme from '../theme';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../utils/supabase';

// Types for content items
interface ContentItem {
  id: number;
  word?: string;
  gif?: string;
  png?: string;
}

interface ContentBank {
  words: ContentItem[];
  gifs: ContentItem[];
  png: ContentItem[];
}

type ContentType = 'words' | 'gifs' | 'png';

// Type for saved markers
interface MarkerData {
  contentId: number;
  contentType: ContentType;
  x: number;
  y: number;
  savedToDb?: boolean;
}

// Game progress storage keys
const GAME_PROGRESS_KEY = 'muuuuuum_game_progress';
const GAME_COMPLETED_KEY = 'muuuuuum_game_completed';
const SESSION_ID_KEY = 'muuuuuum_session_id';

const GamePage = () => {
  // State for content bank and current content
  // Removed unused contentBank state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);
  
  // Game state
  const [sessionId, setSessionId] = useState<string>('');
  const [contentQueue, setContentQueue] = useState<{item: ContentItem, type: ContentType}[]>([]);
  const [currentContent, setCurrentContent] = useState<{item: ContentItem, type: ContentType} | null>(null);
  const [contentVisible, setContentVisible] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<{x: number, y: number} | null>(null);
  const [savedMarkers, setSavedMarkers] = useState<MarkerData[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [saveInProgress, setSaveInProgress] = useState(false);
  
  // Initialize or get session ID
  useEffect(() => {
    // Get an existing session ID or create a new one
    let existingSessionId = localStorage.getItem(SESSION_ID_KEY);
    if (!existingSessionId) {
      existingSessionId = uuidv4();
      localStorage.setItem(SESSION_ID_KEY, existingSessionId);
    }
    setSessionId(existingSessionId);
  }, []);
  
  // Ensure the image path is correctly formatted with the base URL
  const getFormattedPath = (path?: string) => {
    if (!path) return '';
    
    // If it's already an absolute path with the base URL, use it as is
    if (path.startsWith('/MuuuuuuM/')) {
      return path;
    }
    
    // If it's an absolute path without the base URL, add it
    if (path.startsWith('/')) {
      return `/MuuuuuuM${path}`;
    }
    
    // If it's a relative path, make it absolute with the base URL
    if (path.startsWith('./') || path.startsWith('../')) {
      return `/MuuuuuuM/${path.replace(/^\.\//, '')}`;
    }
    
    // For other cases, assume it's a relative path from the root
    return `/MuuuuuuM/${path}`;
  };
  
  // Load content bank on component mount
  useEffect(() => {
    const fetchContentBank = async () => {
      try {
        setLoading(true);
        
        // Try to fetch the content bank
        const response = await fetch('/MuuuuuuM/content/bank.json');
        if (!response.ok) {
          throw new Error(`Failed to load content: ${response.status} ${response.statusText}`);
        }
        
        const data: ContentBank = await response.json();
        
        // Process the data to ensure paths are correct
        if (data.gifs) {
          data.gifs = data.gifs.map(gif => ({
            ...gif,
            gif: getFormattedPath(gif.gif)
          }));
        }
        
        if (data.png) {
          data.png = data.png.map(png => ({
            ...png,
            png: getFormattedPath(png.png)
          }));
        }
        
        // Removed setting contentBank as it is unused
        console.log('Content bank loaded:', data);
        
        // Check if game was already completed
        const completed = localStorage.getItem(GAME_COMPLETED_KEY) === 'true';
        setGameCompleted(completed);
        
        if (!completed) {
          // Load saved progress or create new content queue
          const savedProgress = localStorage.getItem(GAME_PROGRESS_KEY);
          if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            setSavedMarkers(progress.savedMarkers || []);
            
            // Recreate content queue from saved progress
            const usedContentIds = progress.savedMarkers.map(
              (marker: MarkerData) => `${marker.contentType}_${marker.contentId}`
            );
            
            const newQueue = createContentQueue(data, usedContentIds);
            setContentQueue(newQueue);
            if (newQueue.length > 0) {
              setCurrentContent(newQueue[0]);
            }
          } else {
            // No saved progress, create new queue
            const newQueue = createContentQueue(data, []);
            setContentQueue(newQueue);
            if (newQueue.length > 0) {
              setCurrentContent(newQueue[0]);
            }
          }
        }
        
      } catch (err) {
        console.error('Error loading content:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };
    
    fetchContentBank();
  }, []);
  
  // Create a mixed queue of content from all types
  const createContentQueue = (bank: ContentBank, usedContentIds: string[]) => {
    if (!bank) return [];
    
    const queue: {item: ContentItem, type: ContentType}[] = [];
    
    // Add words that haven't been marked yet
    if (bank.words) {
      bank.words.forEach(word => {
        if (!usedContentIds.includes(`words_${word.id}`)) {
          queue.push({ item: word, type: 'words' });
        }
      });
    }
    
    // Add gifs that haven't been marked yet
    if (bank.gifs) {
      bank.gifs.forEach(gif => {
        if (!usedContentIds.includes(`gifs_${gif.id}`)) {
          queue.push({ item: gif, type: 'gifs' });
        }
      });
    }
    
    // Add png images that haven't been marked yet
    if (bank.png) {
      bank.png.forEach(png => {
        if (!usedContentIds.includes(`png_${png.id}`)) {
          queue.push({ item: png, type: 'png' });
        }
      });
    }
    
    // Shuffle the queue for randomness
    return queue.sort(() => Math.random() - 0.5);
  };

  // Place marker on the grid
  const handlePlaceMarker = (x: number, y: number) => {
    setMarkerPosition({ x, y });
  };

  // Show the current content item
  const handleShowContent = () => {
    setContentVisible(true);
  };
  
  // Save response to Supabase database
  const saveResponseToDatabase = async (marker: MarkerData) => {
    if (!sessionId) return false;
    
    try {
      setSaveInProgress(true);
      setDbError(null);
      
      const { data, error } = await supabase
        .from('game_responses')
        .insert([{
          session_id: sessionId,
          content_id: marker.contentId,
          content_type: marker.contentType,
          position_x: marker.x,
          position_y: marker.y,
          metadata: {
            content_info: currentContent?.item,
            browser_info: navigator.userAgent
          }
        }]);
        
      if (error) {
        console.error('Supabase error saving response:', error);
        setDbError(`Database error: ${error.message}`);
        return false;
      }
      
      console.log('Response saved to database:', data);
      return true;
    } catch (err) {
      console.error('Error saving to database:', err);
      setDbError(err instanceof Error ? err.message : 'Failed to save response');
      return false;
    } finally {
      setSaveInProgress(false);
    }
  };
  
  // Save the current marker and move to next content
  const handleSaveMarker = async () => {
    if (!markerPosition || !currentContent) return;
    
    // Save the current marker
    const newMarker: MarkerData = {
      contentId: currentContent.item.id,
      contentType: currentContent.type,
      x: markerPosition.x,
      y: markerPosition.y
    };
    
    // Try to save to database
    const savedToDb = await saveResponseToDatabase(newMarker);
    newMarker.savedToDb = savedToDb;
    
    const updatedMarkers = [...savedMarkers, newMarker];
    setSavedMarkers(updatedMarkers);
    
    // Update the queue and current content
    const newQueue = contentQueue.slice(1);
    setContentQueue(newQueue);
    
    // Reset for next item
    setMarkerPosition(null);
    setContentVisible(false);
    
    if (newQueue.length > 0) {
      setCurrentContent(newQueue[0]);
    } else {
      // Game completed
      setCurrentContent(null);
      setGameCompleted(true);
      localStorage.setItem(GAME_COMPLETED_KEY, 'true');
    }
    
    // Save progress
    localStorage.setItem(GAME_PROGRESS_KEY, JSON.stringify({
      savedMarkers: updatedMarkers,
      timestamp: new Date().toISOString()
    }));
  };

  // Reset the game (for testing)
  const handleResetGame = () => {
    if (window.confirm('Are you sure you want to reset the game? All progress will be lost.')) {
      localStorage.removeItem(GAME_PROGRESS_KEY);
      localStorage.removeItem(GAME_COMPLETED_KEY);
      window.location.reload();
    }
  };

  // Check if we can save the marker (both content shown and marker placed)
  const canSave = contentVisible && markerPosition && currentContent && !saveInProgress;

  return (
    <ThemeProvider theme={Theme}>
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Emotional Response Mapper
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom align="center" sx={{ mb: 4 }}>
            Mark how you feel about each content item on the like/dislike and engaging/disengaging axes
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {dbError && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              {dbError} - Your response was saved locally but may not have been saved to the server.
            </Alert>
          )}
          
          {loading ? (
            <Alert severity="info">Loading content...</Alert>
          ) : gameCompleted ? (
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center', mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Game Completed!
              </Typography>
              <Typography paragraph>
                Thank you for participating. You've responded to all available content items.
              </Typography>
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={handleResetGame}
                sx={{ mt: 2 }}
              >
                Reset Game (Testing Only)
              </Button>
            </Paper>
          ) : (
            <>
              {/* Content Display */}
              <ContentDisplay 
                content={currentContent?.item || null}
                contentType={currentContent?.type || null}
                onShowContent={handleShowContent}
                contentVisible={contentVisible}
              />
              
              {/* Marker Grid */}
              <MarkerGrid 
                onPlaceMarker={handlePlaceMarker}
                markerPosition={markerPosition}
                disabled={!contentVisible || gameCompleted}
              />
              
              {/* Action Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!canSave}
                  onClick={handleSaveMarker}
                >
                  {saveInProgress ? 'Saving...' : 'Save & Continue'}
                </Button>
                
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleResetGame}
                >
                  Reset Game
                </Button>
              </Box>
              
              {/* Progress Indicator */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" align="center" gutterBottom>
                  Progress: {savedMarkers.length} / {savedMarkers.length + contentQueue.length} items completed
                </Typography>
                <Box 
                  sx={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      backgroundColor: Theme.palette.primary.main,
                      width: `${savedMarkers.length / (savedMarkers.length + contentQueue.length) * 100}%`,
                      transition: 'width 0.5s ease-in-out'
                    }}
                  />
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default GamePage;