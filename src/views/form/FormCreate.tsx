import { Box } from '@mui/material';
import { CreateFormPanel } from '../../components/CreateFormPanel/CreateFormPanel';
import { ApplicationBar } from '../../components/AppBar/AppBar';

export const FormCreate = () => {
  return (
    <>
      <ApplicationBar />
      <Box sx={{ height: '100%', width: '100%' }}>
        <CreateFormPanel />
      </Box>
    </>
  );
};
