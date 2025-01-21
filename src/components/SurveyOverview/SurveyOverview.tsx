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
  Tooltip,
} from '@mui/material';
import { CalendarToday, OpenInNew, FileCopy } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import moment from 'moment';
import useAxios from '../../hooks/useAxios';
import { toast } from 'react-toastify';
import { getAuthHeader } from '../../utils/utils';
import { DateTimePicker } from '@mui/x-date-pickers';
import { SummaryDataType } from '../Statistics/StatisticsPanel';

export type SurveyOverviewProps = {
  link: string;
  title: string;
  closingTime: string;
  questionsCount: number;
  answersCount: number;
};

export const SurveyOverview = (props: SurveyOverviewProps) => {
  const currentDate = new Date();
  const startDate = new Date(Date.now());
  const endDate = new Date(props.closingTime);
  const [closingDate, setClosingDate] = useState(props.closingTime);
  const isActive = currentDate >= startDate && currentDate <= endDate;
  const { axiosRequest } = useAxios();
  const [summaryData, setSummaryData] = useState<SummaryDataType>({} as SummaryDataType);
  const [questionLength, setQuestionLength] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newEndDate, setNewEndDate] = useState<Date | null>(new Date(props.closingTime));

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleSubmit = async () => {
    const response = await axiosRequest(
      'PATCH',
      `forms/${props.link}/closing-time`,
      { newClosingTime: newEndDate },
      getAuthHeader()
    );

    if (response?.status === 200) {
      toast.success('Closing date changed!');

      const formattedDate = moment(newEndDate).format('DD-MM-YYYY');
      setClosingDate(formattedDate);
    } else {
      toast.error('Error while changing closing time!');
    }

    handleCloseDialog();
  };

  const handleCopyToClipboard = () => {
    const surveyUrl = `${window.location.origin}/form/${props.link}`;
    navigator.clipboard.writeText(surveyUrl).then(
      () => toast.success('Survey URL copied to clipboard!'),
      () => toast.error('Failed to copy Survey URL')
    );
  };

  useEffect(() => {
    const fetchSummary = async () => {
      const summaryReponse = await axiosRequest('GET', `forms/${props.link}/summary`, null, getAuthHeader());
      setSummaryData(summaryReponse?.data);
      const questionListResponse = await axiosRequest('GET', `forms/${props.link}`, null, getAuthHeader());
      setQuestionLength(questionListResponse?.data.questions.length);
    };
    fetchSummary();
  }, [axiosRequest, props.link]);

  return (
    <Box
      component={Paper}
      sx={{
        padding: 3,
        width: { xs: '90vw', sm: '30vw' },
        background: 'linear-gradient(135deg, #ffffff, #f9f9f9)',
        border: '1px solid #ececec',
        boxShadow: '0px 10px 20px -5px rgba(25, 118, 210, 0.3)',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0px 4px 12px rgba(25, 118, 210, 0.4)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 600, color: '#333' }}>
          {props.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Change Closing Date
          </Typography>
          <IconButton
            onClick={handleOpenDialog}
            disabled={!isActive}
            sx={{
              backgroundColor: '#f0f4ff',
              color: '#1976d2',
              '&:hover': {
                backgroundColor: '#dce4f9',
              },
            }}
          >
            <CalendarToday />
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#666' }}>
            Status
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: isActive ? '#4caf50' : '#f44336',
              fontSize: '1.2rem',
            }}
          >
            {isActive ? 'ACTIVE' : 'INACTIVE'}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#777' }}>
            Start Date
          </Typography>
          <Typography variant="body2" sx={{ color: '#333' }}>
            {moment(startDate).format('DD-MM-YYYY')}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#777' }}>
            End Date
          </Typography>
          <Typography variant="body2" sx={{ color: '#333' }}>
            {moment(closingDate).format('DD-MM-YYYY') === 'Invalid date' ? closingDate : moment(closingDate).format('DD-MM-YYYY')}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#777' }}>
            Question Count
          </Typography>
          <Typography variant="body2" sx={{ color: '#333' }}>
            {questionLength}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#777' }}>
            Response Count
          </Typography>
          <Typography variant="body2" sx={{ color: '#333' }}>
            {summaryData.totalResponses}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: {xs:'column', xl: 'row'}, justifyContent: 'space-evenly' }}>
        <Tooltip
          title={summaryData.totalResponses === 0 ? 'No responses available yet' : 'View detailed statistics'}
          arrow
        >
          <Box display="flex" justifyContent="center" mt={3}>
            <Button
              href={`/statistics/${props.link}`}
              variant="contained"
              size="medium"
              sx={{
                backgroundColor: '#1976d2',
                color: '#fff',
                borderRadius: '20px',
                padding: '8px 24px',
                boxShadow: '0px 4px 12px rgba(25, 118, 210, 0.4)',
                '&:hover': {
                  color: '#fff',
                  boxShadow: '0px 6px 16px rgba(25, 118, 210, 0.6)',
                },
              }}
              endIcon={<OpenInNew />}
              disabled={summaryData.totalResponses === 0}
            >
              View Details
            </Button>
          </Box>
        </Tooltip>

        <Box display="flex" justifyContent="center" mt={3}>
          <Tooltip title="Copy Survey URL" arrow>
            <Button
            disabled={!isActive}
              onClick={handleCopyToClipboard}
              variant='contained'
              sx={{
                color: '#ffffff',
                borderRadius: '20px',
                padding: '8px 24px',
                boxShadow: '0px 4px 12px rgba(25, 118, 210, 0.4)',
                '&:hover': {
                  color: '#fff',
                  boxShadow: '0px 6px 16px rgba(25, 118, 210, 0.6)',
                },
              }}
              endIcon={<FileCopy />}
            >
              <Typography>Copy link to clipboard</Typography>
            </Button>
          </Tooltip>
        </Box>

        <Box display="flex" justifyContent="center" mt={3}>
          <Tooltip title="See All Responses" arrow>
            <Button
              href={`/responses/${props.link}/answers`}
              disabled={summaryData.totalResponses === 0}
              sx={{
                backgroundColor: '#1976d2',
                color: '#fff',
                borderRadius: '20px',
                padding: '8px 24px',
                boxShadow: '0px 4px 12px rgba(25, 118, 210, 0.4)',
                '&:hover': {
                  color: '#fff',
                  boxShadow: '0px 6px 16px rgba(25, 118, 210, 0.6)',
                },
              }}
              endIcon={<OpenInNew />}
            >
              <Typography>View Answers</Typography>
            </Button>
          </Tooltip>
        </Box>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Change Survey Closing Date</DialogTitle>
        <DialogContent>
          <DateTimePicker
            label="New Closing Date"
            value={moment(newEndDate)}
            onChange={newValue => setNewEndDate(moment(newValue).toDate())}
            disablePast
            sx={{ my: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
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
