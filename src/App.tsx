import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'; // Use BrowserRouter
import { Box, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Register } from './views/Register';
import { Login } from './views/Login';
import { useMemo } from 'react';
import { Home } from './views/Home';

function App() {
  const theme = useMemo(
    () =>
      createTheme({
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                color: 'white',
                display: 'flex',
                flexWrap: 'nowrap',
                height: '3rem',
                borderColor: '#e51445',
                borderRadius: '40px',
                textTransform: 'capitalize',
                fontWeight: '600',
              },
            },
          },
          MuiDivider: {
            styleOverrides: {
              root: {
                borderColor: '#7743DB',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundColor: '#FFFBF5',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                width: '100%'
              }
            }
          }
        },
      }),
    []
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ width: '100vw', height: '100vh' }}>
        <Router>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App;