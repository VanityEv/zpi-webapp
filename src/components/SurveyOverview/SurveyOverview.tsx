import {
  Box,
  Divider,
  Paper,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
} from '@mui/material';
import { CalendarToday, OpenInNew } from '@mui/icons-material';
import { useState } from 'react';
import moment from 'moment';
import useAxios from '../../hooks/useAxios';
import { toast } from 'react-toastify';
import { getAuthHeader } from '../../utils/utils';
import { DateTimePicker } from '@mui/x-date-pickers';

export type SurveyOverviewProps = {
  link: string;
  title: string;
  startDate: string;
  endDate: string;
  questionsCount: number;
  answersCount: number;
};

export const SurveyOverview = (props: SurveyOverviewProps) => {
  const currentDate = new Date();
  const startDate = new Date(props.startDate);
  const endDate = new Date(props.endDate);
  const isActive = currentDate >= startDate && currentDate <= endDate;
  const {axiosRequest} = useAxios();

  const [openDialog, setOpenDialog] = useState(false);
  const [newEndDate, setNewEndDate] = useState<Date | null>(new Date(props.endDate));

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleSubmit = async () => {
    console.log(newEndDate?.toISOString());
    const response = await axiosRequest('PATCH', `forms/${props.link}/closing-time`, {newClosingTime: newEndDate?.toISOString()}, getAuthHeader());
    if (response?.status === 200) {
      toast.success('Closing date changed!')
    }
    else {
      toast.error('Error while changing closing time!')
    }
    handleCloseDialog();
  };

  return (
    <Box
      component={Paper}
      sx={{
        padding: 2,
        width: {xs:'90vw', sm:'30vw'},
        border: '1px solid #ccc',
        boxShadow: 2,
        borderRadius: 2,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
          {props.title}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Typography>Change End Date</Typography>
          <IconButton
            onClick={handleOpenDialog}
            disabled={!isActive}
            color="primary"
            sx={{
              marginLeft: 2,
              backgroundColor: '#f0f0f0',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            }}
          >
            <CalendarToday />
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ mb: 1 }} />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            Status
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 600, color: isActive ? 'green' : 'red' }}>
            {isActive ? 'ACTIVE' : 'INACTIVE'}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 1 }} />

      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Start Date
          </Typography>
          <Typography variant="body2">{moment(props.startDate).format('DD-MM-YYYY')}</Typography>
        </Box>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            End Date
          </Typography>
          <Typography variant="body2">{moment(props.endDate).format('DD-MM-YYYY')}</Typography>
        </Box>

      </Box>

      <Divider sx={{ mb: 1 }} />

      <Box display="flex" justifyContent="space-between">
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Question Count
          </Typography>
          <Typography variant="body2">{props.questionsCount}</Typography>
        </Box>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Response Count
          </Typography>
          <Typography variant="body2">{props.answersCount}</Typography>
        </Box>
      </Box>

      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          href={`/statistics/${props.link}`}
          variant="outlined"
          color="primary"
          size="small"
          sx={{
            borderRadius: '12px',
            padding: '6px 16px',
            borderColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1976d2',
              color: '#fff',
            },
          }}
          endIcon={<OpenInNew/>}
        >
          View Details
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Change Survey End Date</DialogTitle>
        <DialogContent>
          <DateTimePicker
            label="New End Date"
            value={moment(newEndDate)}
            onChange={newValue => setNewEndDate(moment(newValue).toDate())}
            disablePast
            sx={{ my: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
