import { Box, Typography } from '@mui/material';

export const SurveyCounter = ({
  avgResponsesPerDay,
  totalResponses,
}: {
  avgResponsesPerDay: number;
  totalResponses: number;
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        bgcolor: 'background.paper',
        width: '100%',
        maxWidth: 900,
        margin: 'auto',
      }}
    >
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 600 }}>
        Survey Completion Stats
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          gap: { xs: 2, md: 4 },
          mb: 2,
        }}
      >
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography variant="h6" color="text.secondary" sx={{ height: { xs: '6rem', md: 'auto' } }}>
            Overall Surveys Completed
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            {totalResponses}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography variant="h6" color="text.secondary">
            Average Daily Surveys Completed
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            {avgResponsesPerDay}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
