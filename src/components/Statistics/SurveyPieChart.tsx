import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography, useMediaQuery } from '@mui/material';

interface SurveyPieChartProps {
  title: string;
  data: Record<string, number>;
}

export default function SurveyPieChart({ title, data }: SurveyPieChartProps) {
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));

  const formattedData = Object.entries(data).map(([label, value]) => ({
    label,
    value,
  }));

  return (
    <Box sx={{ width: '100%', maxWidth: 750, mx: 'auto' }}>
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
        {title}
      </Typography>
      <PieChart
        series={[{ data: formattedData }]}
        width={isSmallScreen ? 425 : 750}
        height={isSmallScreen ? 300 : 500}
      />
    </Box>
  );
}
