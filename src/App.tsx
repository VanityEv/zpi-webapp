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
import { Form } from './views/form/Form';
import { ToastContainer } from 'react-toastify';
import { Responses } from './views/Responses';
import { ManageUsers } from './views/ManageUsers';

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
                backgroundColor: '#1976d2',
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
                width: '100%',
              },
            },
          },
          MuiDialogContent: {
            styleOverrides: {
              root: {
                '& .MuiButton-root': {
                  backgroundColor: 'white',
                },
                '& .MuiDateTimePickerToolbar-separator': {
                  fontSize: '2.5rem',
                },
              },
            },
          },
          MuiDialogActions: {
            styleOverrides: {
              root: {
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                '& .MuiButton-root': {
                  backgroundColor: '#1976d2',
                  padding: '1rem 1.5rem',
                },
              },
            },
          },
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                scrollbarColor: '#cccccc #eeeeee',
                '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                  backgroundColor: '#2b2b2b',
                },
                '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                  borderRadius: 8,
                  backgroundColor: '#dddddd',
                  minHeight: 24,
                  border: '3px solid #2b2b2b',
                },
                '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
                  backgroundColor: '#959595',
                },
                '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
                  backgroundColor: '#959595',
                },
                '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: '#959595',
                },
                '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
                  backgroundColor: '#2b2b2b',
                },
              },
            },
          },
        },
      }),
    []
  );
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <CssBaseline />
        <Box sx={{ width: '100vw', height: '100vh', overflowX: 'hidden' }}>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/form/create" element={<FormCreate />} />
              <Route path="/statistics/:formID" element={<Statistics />} />
              <Route path="/form/:formID" element={<Form />} />
              <Route path="/responses" element={<Responses />} />
              <Route path="/manage-users" element={<ManageUsers/>}/>
            </Routes>
          </Router>
          <ToastContainer position='bottom-right' />
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
