import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Theme from './theme';
import Header from './pages/Header';
import SinglePage from './pages/SinglePage';
import HomePage from './pages/HomePage';

function App() {

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
}

export default App;