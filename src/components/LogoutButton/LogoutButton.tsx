import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCookie, removeCookie } from 'typescript-cookie';

export const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeCookie('token');
    if(!getCookie){
        toast.success('You are Logged Out!');
    }
    navigate('/login');
    
    
  }

  return (
    <Button variant="contained" color="secondary" onClick={handleLogout}>
      Logout
    </Button>
  );
};
