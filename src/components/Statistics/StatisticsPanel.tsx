import { Box, Typography } from '@mui/material';
import { SurveyCounter } from './SurverysCounter';
import AnswersChart from './AnswersChart';
import SurveysPerDayChart from './SurveyPerDayChart';
import QuestionList from './QuestionList';
import SurveyPieChart from './SurveyPieChart';
import { ageData, genderData } from './pieChart.data';
import { ApplicationBar } from '../AppBar/AppBar';
import useAxios from '../../hooks/useAxios';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAuthHeader } from '../../utils/utils';

export const StatisticsPanel = () => {

  const {axiosRequest} = useAxios();
  const params = useParams();
  const formId = params.formID;


  useEffect(() => {
    const fetchStatistics = async () => {
      const response = await axiosRequest('GET', `forms/${formId}/answers`, null, getAuthHeader());
      console.log(response?.data);
    }
    fetchStatistics();
  }, [axiosRequest, formId]);
  return (
    <>
    <ApplicationBar/>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        m: { xs: '0', md: '6rem' },
        '&>*': { px: { xs: '1rem', md: '5rem' } },
      }}
    >
      <Box>
        <Typography variant="h4" textAlign="center">
          Survey Statistics
        </Typography>
        <Typography textAlign="center">Test title #1</Typography>
      </Box>
      <Box
        sx={{
          height: '100%',
          width: '100%',
          display: { md: 'grid', xs: 'flex' },
          flexDirection: { xs: 'column' },
          gap: '3rem',
          gridTemplateColumns: '50% 50%',
          position: 'relative',
        }}
      >
        <SurveyCounter />
        <SurveysPerDayChart />
        <AnswersChart />
        <QuestionList />
        <SurveyPieChart title="Gender of respondents" data={genderData} />
        <SurveyPieChart title="Age group of respondents" data={ageData} />
      </Box>
    </Box>
    </>
  );
};
