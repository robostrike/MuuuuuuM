import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Theme from './theme';
import DatabaseTest from './components/DatabaseTest';
import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage';
import FreeGrid from './pages/FreeGrid';
import FreeLocale from './pages/FreeLocale';
import ContainedPage from './pages/containedPage';
import Header from './components/Header';

function App() {

  return (

      <ThemeProvider theme={Theme}>
        <BrowserRouter basename="/MuuuuuuM">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/db-test" element={<DatabaseTest />} />
            <Route path="/grid" element={<FreeGrid />} />
            <Route path="/locale" element={<FreeLocale />} />
            <Route path="/contain" element={<ContainedPage />} />
            {/* Add other routes as needed */}
          </Routes>
        </BrowserRouter>
      </ThemeProvider>

  );
}

export default App;