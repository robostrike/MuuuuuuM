import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Theme from './theme';
import ContainedPage from './pages/containedPage';
import Header from './components/Header';
import SinglePage from './pages/SinglePage';

function App() {

  return (
    <ThemeProvider theme={Theme}>
      <BrowserRouter basename="/MuuuuuuM">
        <Header />
          <Routes>
            <Route path="/" element={<ContainedPage />} />
            <Route path="/single" element={<SinglePage />} />
            <Route path="/contain" element={<ContainedPage />} />
          </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;