import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { FormPanel } from '../../components/FormPanel/FormPanel';
import { ApplicationBar } from '../../components/AppBar/AppBar';

export const Form = () => {
  const { formID } = useParams<{ formID: string }>();

  return (
    <>
      <ApplicationBar />
      <Box sx={{ height: '100%', width: '100%' }}>
        <FormPanel formID={formID} />
      </Box>
    </>
  );
};
