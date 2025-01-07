import { Box } from '@mui/material';
import { LoginPanel } from '../components/LoginPanel/LoginPanel';

export const Login = () => {
  return (
    <Box
      sx={{
        height: '100vh', 
        width: '100vw', 
        display: {xs:'flex',sm:'grid'},
        gridTemplateColumns: '1fr 1fr', 
        alignItems: 'center',          
        justifyItems: 'center',        
      }}
    >
      <Box sx={{ textAlign: 'center', display:{xs:'none', sm:'block'} }}>
        <img
          src="image.jpg"
          alt="Illustration"
          style={{ width: '75%' }}
        />
      </Box>
      <LoginPanel />
    </Box>
  );
};
