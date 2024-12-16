import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import { useState } from 'react';

export default function AnswersChart() {
  const [mockData, setData] = useState<number[][]>([
    [10, 12, 15, 7],
    [18, 14, 9, 11],
    [13, 9, 8, 14],
    [16, 12, 10, 15],
    [11, 8, 17, 13],
    [9, 10, 13, 15],
    [12, 18, 11, 9],
  ]);

  const randomizeData = () => {
    setData(Array.from({ length: 7 }, () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 20) + 1)));
  };

  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));

  return (
    <Box sx={{ width: '100%', height: '100%', p: { xs: '0', md: '5rem' } }}>
      <Typography variant="h5" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        Answers Chart
      </Typography>
      <Button onClick={randomizeData} variant="contained" color="primary" sx={{ width: '140px', mb: 3 }}>
        Randomize Data
      </Button>
      <Box sx={{ width: '100%', height: '100%', minHeight: '25vh' }}>
        <BarChart
          xAxis={[
            {
              id: 'questions',
              data: ['Question 1', 'Question 2', 'Question 3', 'Question 4', 'Question 5', 'Question 6', 'Question 7'],
              scaleType: 'band',
            },
          ]}
          series={[
            { data: mockData.map(q => q[0]), label: 'A' },
            { data: mockData.map(q => q[1]), label: 'B' },
            { data: mockData.map(q => q[2]), label: 'C' },
            { data: mockData.map(q => q[3]), label: 'D' },
          ]}
          width={isSmallScreen ? 425 : 1000}
          height={isSmallScreen ? 350 : 500}
        />
      </Box>
    </Box>
  );
}
