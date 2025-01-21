import { Box, Typography, useMediaQuery } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { SummaryDataType } from './StatisticsPanel';

export default function SurveysPerDayChart({ dailyResponses }: { dailyResponses: SummaryDataType['dailyResponses'] }) {
  const generateConsecutiveDates = (count: number, startDate: string) => {
    return Array.from({ length: count }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return date.toISOString().split('T')[0];
    });
  };

  const sortedData = dailyResponses.sort((a, b) => a.date.localeCompare(b.date));
  const chartData = {
    dates: generateConsecutiveDates(dailyResponses.length ?? 1, sortedData[0].date),
    values: sortedData.map(response => response.responseCount),
  };

  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));

  return (
    <Box sx={{ width: '100%', height: '90%', px: { xs: 0, md: '3rem' }, py: '5rem' }}>
      <Typography variant="h5" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        Surveys Completed / Day
      </Typography>

      <Box sx={{ width: '100%', height: '100%', minHeight: '25vh' }}>
        <LineChart
          xAxis={[
            {
              id: 'dates',
              data: chartData.dates,
              scaleType: 'band',
            },
          ]}
          yAxis={[
            {
              id: 'responseCounts',
              min: 0,
            },
          ]}
          series={[
            {
              data: chartData.values,
            },
          ]}
          width={isSmallScreen ? 425 : 1000}
          height={isSmallScreen ? 350 : 500}
        />
      </Box>
    </Box>
  );
}
