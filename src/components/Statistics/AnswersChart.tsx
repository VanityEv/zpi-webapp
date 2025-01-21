import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';

interface FormAnswer {
  questionId: string;
  chosenAnswerIndexes?: number[];
  freetextAnswer?: string;
}

interface AnswerData {
  id: string;
  respondentData: {
    userEmail: string;
    birthdate: string;
    gender: string;
  };
  filledOutAt: string;
  formAnswers: FormAnswer[];
}

interface AnswersChartProps {
  answersData: AnswerData[];
}

export default function AnswersChart({ answersData }: AnswersChartProps) {
  const [chartData, setChartData] = useState<number[][]>([]);
  const [questionLabels, setQuestionLabels] = useState<string[]>([]);
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));

  useEffect(() => {
    if (answersData.length === 0) return;

    const questionMap: { [key: string]: number[] } = {};

    // Mapowanie odpowiedzi na pytania, uwzględniając tylko odpowiedzi jednokrotnego wyboru
    answersData.forEach(({ formAnswers }) => {
      formAnswers.forEach(({ questionId, chosenAnswerIndexes }) => {
        if (chosenAnswerIndexes && chosenAnswerIndexes.length === 1) {
          if (!questionMap[questionId]) {
            questionMap[questionId] = [0, 0, 0, 0]; // Zakładając, że są 4 odpowiedzi
          }
          // Zwiększamy licznik odpowiedzi wybranego indeksu
          questionMap[questionId][chosenAnswerIndexes[0]]++;
        }
      });
    });

    // Generowanie etykiet pytania w formacie "Question 1", "Question 2", itd.
    const labels = Object.keys(questionMap);
    const data = labels.map(questionId => questionMap[questionId]);

    setQuestionLabels(labels.map((_, index) => `Question ${index + 1}`)); // Ustawienie etykiet
    setChartData(data); // Ustawienie danych wykresu
  }, [answersData]);

  return (
    <Box sx={{ width: '100%', height: '100%', p: { xs: '0', md: '5rem' } }}>
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
        Answers Chart
      </Typography>
      <Box sx={{ width: '100%', height: '100%', minHeight: '25vh' }}>
        <BarChart
          xAxis={[
            {
              id: 'questions',
              data: questionLabels,
              scaleType: 'band',
            },
          ]}
          series={[
            { data: chartData.map(q => q[0]), label: 'A' },
            { data: chartData.map(q => q[1]), label: 'B' },
            { data: chartData.map(q => q[2]), label: 'C' },
            { data: chartData.map(q => q[3]), label: 'D' },
          ]}
          width={isSmallScreen ? 425 : 1000}
          height={isSmallScreen ? 350 : 500}
        />
      </Box>
    </Box>
  );
}
