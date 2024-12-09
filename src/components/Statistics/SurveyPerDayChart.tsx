import { Box, Typography, Button } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useState } from "react";

export default function SurveysPerDayChart() {
  const generateConsecutiveDates = (count: number) => {
    const today = new Date();
    return Array.from({ length: count }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i); 
      return date.toISOString().split("T")[0]; 
    });
  };

  const [chartData, setChartData] = useState({
    dates: generateConsecutiveDates(14),
    values: Array.from({ length: 14 }, () => Math.ceil(Math.random() * 10)), 
  });

  const randomizeData = () => {
    setChartData({
      dates: generateConsecutiveDates(14), 
      values: Array.from({ length: 14 }, () => Math.floor(Math.random() * 10) + 1), 
    });
  };

  return (
    <Box sx={{ width: "100%", height: "90%", px: "3rem", py: "5rem" }}>
      <Typography
        variant="h5"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        Surveys Completed / Day
      </Typography>
      <Button
        onClick={randomizeData}
        variant="contained"
        color="primary"
        sx={{ width: "140px", mb: 3 }}
      >
        Randomize Data
      </Button>
      <Box sx={{ width: "100%", height: "100%", minHeight: "25vh" }}>
        <LineChart
          xAxis={[
            {
              id: "dates",
              data: chartData.dates,
              scaleType: "band",
            },
          ]}
          series={[
            {
              data: chartData.values,
            },
          ]}
          width={1000}
          height={500}
        />
      </Box>
    </Box>
  );
}
