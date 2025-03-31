import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, CircularProgress } from '@mui/material';

interface ContentItem {
  id: number;
  word?: string;
  gif?: string;
  png?: string;
}

interface ContentDisplayProps {
  content: ContentItem | null;
  contentType: 'words' | 'gifs' | 'png' | null;
  onShowContent: () => void;
  contentVisible: boolean;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({
  content,
  contentType,
  onShowContent,
  contentVisible
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset loading/error states when content changes
  useEffect(() => {
    setLoading(false);
    setError(null);
  }, [content]);

  // Handle media loading for images/gifs
  const handleMediaLoad = () => {
    console.log('Media loaded successfully');
    setLoading(false);
  };

  const handleMediaError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Media load error:', e);
    console.error('Failed to load image from path:', (e.target as HTMLImageElement).src);
    setLoading(false);
    setError('Failed to load media content');
  };

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

  const renderContent = () => {
    if (!content || !contentVisible) {
      return (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={onShowContent}
            disabled={!content}
          >
            {content ? 'Show Content' : 'No Content Available'}
          </Button>
        </Box>
      );
    }

    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => {
              setError(null);
              setLoading(true);
              onShowContent();
            }}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        </Box>
      );
    }

    // Render different content types
    switch (contentType) {
      case 'words':
        return (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h3">{content.word}</Typography>
          </Box>
        );
      
      case 'gifs':
        const gifPath = getFormattedPath(content.gif);
        console.log('Attempting to load GIF from path:', gifPath);
        
        return (
          <Box sx={{ p: 2, textAlign: 'center', position: 'relative' }}>
            {loading && (
              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <CircularProgress size={40} />
              </Box>
            )}
            <Box sx={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={gifPath}
                alt="Content GIF" 
                style={{ maxWidth: '100%', maxHeight: '300px' }}
                onLoad={handleMediaLoad}
                onError={handleMediaError}
                crossOrigin="anonymous"
              />
            </Box>
          </Box>
        );
      
      case 'png':
        const pngPath = getFormattedPath(content.png);
        console.log('Attempting to load PNG from path:', pngPath);
        
        return (
          <Box sx={{ p: 2, textAlign: 'center', position: 'relative' }}>
            {loading && (
              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <CircularProgress size={40} />
              </Box>
            )}
            <Box sx={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={pngPath}
                alt="Content Image" 
                style={{ maxWidth: '100%', maxHeight: '300px' }}
                onLoad={handleMediaLoad}
                onError={handleMediaError}
                crossOrigin="anonymous"
              />
            </Box>
          </Box>
        );
      
      default:
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography>Unknown content type</Typography>
          </Box>
        );
    }
  };

  // Set loading state when rendering media content
  useEffect(() => {
    if (contentVisible && content && (contentType === 'gifs' || contentType === 'png')) {
      setLoading(true);
    }
  }, [content, contentType, contentVisible]);

  return (
    <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden' }}>
      <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
        <Typography variant="h6">
          {content ? `Content #${content.id}` : 'No Content Selected'}
        </Typography>
      </Box>
      
      <Box sx={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {renderContent()}
      </Box>
    </Paper>
  );
};

export default ContentDisplay;