import { Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { CreateFormPanel } from '../../components/CreateFormPanel/CreateFormPanel';

export const FormCreate = () => {
  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <CreateFormPanel />
      <ToastContainer />
    </Box>
  );
};