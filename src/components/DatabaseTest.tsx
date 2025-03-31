import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Paper, 
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert
} from '@mui/material';

// Define a test item type
interface TestItem {
  id: string;
  created_at: string;
  name: string;
  description?: string;
}

const DatabaseTest = () => {
  const [items, setItems] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');

  // Test database connection on component mount
  useEffect(() => {
    testConnection();
    fetchItems();
  }, []);

  // Test the connection to Supabase
  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simple query to check if we can connect
      const { data, error } = await supabase.from('test_items').select('count', { count: 'exact' });
      
      if (error) throw error;
      
      setConnectionStatus('connected');
    } catch (err) {
      console.error('Database connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to database');
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all items from the test table
  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('test_items')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setItems(data || []);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  // Create a new test item
  const createItem = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('test_items')
        .insert([{ name, description }])
        .select();
        
      if (error) throw error;
      
      // Refresh the list
      await fetchItems();
      
      // Clear the form
      setName('');
      setDescription('');
    } catch (err) {
      console.error('Error creating item:', err);
      setError(err instanceof Error ? err.message : 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  // Delete a test item
  const deleteItem = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('test_items')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Refresh the list
      await fetchItems();
    } catch (err) {
      console.error('Error deleting item:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Supabase Database Test
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Connection Status: 
            {connectionStatus === 'unknown' && ' Testing...'}
            {connectionStatus === 'connected' && ' Connected to Supabase'}
            {connectionStatus === 'error' && ' Connection Error'}
          </Typography>
          
          <Button 
            variant="outlined" 
            onClick={testConnection}
            disabled={loading}
            sx={{ mr: 2 }}
          >
            Test Connection
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={fetchItems}
            disabled={loading}
          >
            Refresh Data
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Add New Test Item
          </Typography>
          
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="description"
              label="Description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
            
            <Button
              type="button"
              fullWidth
              variant="contained"
              onClick={createItem}
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Add Item'}
            </Button>
          </Box>
        </Paper>
        
        <Paper>
          <Typography variant="h6" sx={{ p: 2 }}>
            Test Items
          </Typography>
          
          {loading && items.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No items found. Add your first item above.
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.description || '-'}</TableCell>
                        <TableCell>
                          {new Date(item.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          <Button 
                            color="error" 
                            size="small"
                            onClick={() => deleteItem(item.id)}
                            disabled={loading}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default DatabaseTest;
