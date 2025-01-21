import { Box, Divider, Paper, Typography, Button } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import moment from 'moment';

export type AnswersOverviewProps = {
  link: string;
  title: string;
  answerDate: string;
  creatorEmail: string;
};

export const AnswersOverview = (props: AnswersOverviewProps) => {
  return (
    <Box
      component={Paper}
      sx={{
        padding: 3,
        width: { xs: '90vw', sm: '300px' },
        height: { xs: 'auto', sm: '350px' },
        border: '1px solid #e0e0e0',
        boxShadow: '0px 10px 20px -5px rgba(25, 118, 210, 0.3)',
        borderRadius: '25px',
        backgroundColor: '#ffffff',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0px 4px 12px rgba(25, 118, 210, 0.4)',
        },
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" mb={2} textAlign="center">
        <Typography
          variant="h6"
          sx={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#757575',
            textTransform: 'uppercase',
          }}
        >
          Survey Title
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#333333',
          }}
        >
          {props.title}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#757575' }}>
            Survey Created by
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              fontSize: '1rem',
              color: '#1976d2',
              wordBreak: 'break-word',
            }}
          >
            {props.creatorEmail.split('@')[0]}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#757575' }}>
            Answer Date
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1rem', color: '#333' }}>
            {moment(props.answerDate).format('DD-MM-YYYY')}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          href={`/response/${props.link}`}
          variant="outlined"
          color="primary"
          size="medium"
          sx={{
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '0.875rem',
            fontWeight: 600,
            textTransform: 'none',
            borderColor: '#1976d2',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#1976d2',
              color: '#ffffff',
            },
          }}
          endIcon={<OpenInNew />}
        >
          View Answer
        </Button>
      </Box>
    </Box>
  );
};
