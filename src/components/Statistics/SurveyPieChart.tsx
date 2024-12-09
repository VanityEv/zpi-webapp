import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography } from '@mui/material';

interface PieChartProps {
  title: string;
  data: { id: number; value: number; label: string }[];
}

export default function SurveyPieChart({ title, data }: PieChartProps) {
  return (
    <Box sx={{ width: '100%', maxWidth: 750, mx: 'auto'}}>
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
        {title}
      </Typography>
      <PieChart
        series={[{ data }]}
        width={750}
        height={500}
      />
    </Box>
  );
}
