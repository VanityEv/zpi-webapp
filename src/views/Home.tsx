import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

export const Home = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
        <Typography variant="h4" gutterBottom>
          ZPI Projekt
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" color="primary" component={Link} to="/register" sx={{ width: '100%' }}>
            Register
          </Button>
          <Button variant="contained" color="primary" component={Link} to="/login" sx={{ width: '100%', px: '2rem' }}>
            Login
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/statistics"
            sx={{ width: '100%', px: '2rem' }}
          >
            Statistics
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/form/create"
            sx={{ width: '100%', px: '2rem' }}
          >
            Create Form
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
