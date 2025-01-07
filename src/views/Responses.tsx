import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Divider } from '@mui/material';
import { ApplicationBar } from '../components/AppBar/AppBar';
import { getCookie } from 'typescript-cookie';
import { useEffect } from 'react';
import { Poll } from '@mui/icons-material';

export const Responses = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getCookie('token')) {
      navigate('/login');
      return;
    }

  }, [navigate]);


  return (
    <>
      <ApplicationBar />
      <Container component="main" sx={{ mx: 0 }}>
        <Box display="flex" flexDirection="column" minHeight="100vh" mt="5rem" gap='2rem'>
          <Typography variant="h4" gutterBottom sx={{display:'flex', flexDirection:'row', gap:'1rem', alignItems:'center'}}>
            <Poll sx={{color:'blue', width:'32px', height:'32px'}}/>
            You Completed These Surveys:
          </Typography>
          <Divider sx={{width:'100vw'}}/>
          <Box sx={{ width: '100%', display: 'grid', gridTemplateColumns: {xs: '1fr', sm:'1fr 1fr 1fr'}, gap: 4 }}>
            <Typography align="center">No surveys available.</Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
};
