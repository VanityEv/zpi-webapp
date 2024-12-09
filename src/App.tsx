import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'; // Use BrowserRouter
import { Box, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Register } from './views/Register';
import { Login } from './views/Login';
import { useMemo } from 'react';
import { Home } from './views/Home';
import { Statistics } from './views/Statistics';
import { FormCreate } from './views/form/FormCreate';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';


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
                backgroundColor:'#1976d2',
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
                backgroundColor: '#FFFFFF',
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
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <CssBaseline />
        <Box sx={{ width: '100vw', height: '100vh' }}>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path="/form/create" element={<FormCreate />} />
              <Route path='/statistics' element={<Statistics/>} />
            </Routes>
          </Router>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;