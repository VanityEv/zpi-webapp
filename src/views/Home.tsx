import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Divider } from '@mui/material';
import { ApplicationBar } from '../components/AppBar/AppBar';
import { SurveyOverview, SurveyOverviewProps } from '../components/SurveyOverview/SurveyOverview';
import { getCookie } from 'typescript-cookie';
import { useCallback, useEffect, useState } from 'react';
import useAxios from '../hooks/useAxios';
import { getAuthHeader } from '../utils/utils';
import { AlarmOn, Done } from '@mui/icons-material';

export const Home = () => {
  const navigate = useNavigate();
  const [userSurveysData, setUserSurveysData] = useState<SurveyOverviewProps[]>([]);
  const { axiosRequest } = useAxios();

  const fetchUserSurveys = useCallback(async () => {
    try {
      const response = await axiosRequest('GET', 'forms/user', null, getAuthHeader());
      return response?.data || [];
    } catch {
      return [];
    }
  }, [axiosRequest]);

  useEffect(() => {
    if (!getCookie('token')) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      if (userSurveysData.length === 0) {
        const data = await fetchUserSurveys();
        setUserSurveysData(data);
      }
    };

    fetchData();
  }, [navigate, fetchUserSurveys, userSurveysData]);

  const renderSurveys = (filterCondition: (survey: SurveyOverviewProps) => boolean) => (
    userSurveysData.filter(filterCondition).map(survey => (
      <SurveyOverview
        key={survey.link}
        link={survey.link}
        title={survey.title}
        startDate={survey.startDate}
        endDate={survey.endDate}
        questionsCount={survey.questionsCount}
        answersCount={survey.answersCount}
      />
    ))
  );

  return (
    <>
      <ApplicationBar />
      <Container component="main" sx={{ mx: 0, my:'2rem' }}>
        <Box display="flex" flexDirection="column" minHeight="100vh" mt="5rem" gap='2rem'>
          <Typography variant="h4" gutterBottom sx={{display:'flex', flexDirection:'row', gap:'1rem', alignItems:'center'}}>
            <Done sx={{color:'green', width:'32px', height:'32px'}}/>
            Your Active Surveys
          </Typography>
          <Divider sx={{width:'100vw'}}/>
          <Box sx={{ width: '100%', display: 'grid', gridTemplateColumns: {xs: '1fr', sm:'1fr 1fr 1fr'}, gap: 4 }}>
            {userSurveysData.length ? renderSurveys(survey => survey.endDate > new Date().toISOString()) : <Typography align="center">No surveys available.</Typography>}
          </Box>
          <Typography variant="h4" gutterBottom sx={{display:'flex', flexDirection:'row', gap:'1rem', alignItems:'center'}}>
            <AlarmOn sx={{color:'crimson', width:'32px', height:'32px'}}/>
            Your Inactive Surveys
          </Typography>
          <Divider sx={{width:'100vw'}}/>
          <Box sx={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, alignItems:'center' }}>
            {userSurveysData.length ? renderSurveys(survey => survey.endDate <= new Date().toISOString()) : <Typography align="center">No surveys available.</Typography>}
          </Box>
        </Box>
      </Container>
    </>
  );
};
