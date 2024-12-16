import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { FormPanel } from '../../components/FormPanel/FormPanel';
import { ToastContainer } from 'react-toastify';

export const Form = () => {
  const { formID } = useParams<{ formID: string }>();

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <FormPanel formID={formID} />
      <ToastContainer />
    </Box>
  );
};
