import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';

export const SurveyCounter = () => {
  const [data, setData] = useState({ count: 0, avgDailyCount: 0 });

  const randomizeData = () => {
    const randomCount = Math.floor(Math.random() * 100);
    setData({ count: randomCount, avgDailyCount: Number((randomCount / 7).toFixed(0)) });
  };

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

      <Button
        onClick={randomizeData}
        variant="contained"
        color="primary"
        sx={{
          mb: 3,
          borderRadius: 2,
          padding: '10px 20px',
          fontWeight: 500,
          boxShadow: 2,
        }}
      >
        Randomize Data
      </Button>

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
            {data.count}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography variant="h6" color="text.secondary">
            Average Daily Surveys Completed
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            {data.avgDailyCount}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
