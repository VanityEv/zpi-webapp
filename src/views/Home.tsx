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
      const response = await axiosRequest('GET', 'forms/user-created', null, getAuthHeader());
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
  }, [navigate, fetchUserSurveys, userSurveysData.length]);

  const renderSurveysSection = (
    title: string,
    icon: JSX.Element,
    filterCondition: (survey: SurveyOverviewProps) => boolean
  ) => (
    <>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        {icon}
        {title}
      </Typography>
      <Divider sx={{ width: '100vw' }} />
      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
          gap: 4,
        }}
      >
        {userSurveysData.length !== 0 ? (
          userSurveysData.filter(filterCondition).map(survey => <SurveyOverview key={survey.link} {...survey} />)
        ) : (
          <Typography align="center">No surveys available.</Typography>
        )}
      </Box>
    </>
  );

  return (
    <>
      <ApplicationBar />
      <Container component="main" sx={{ mx: 0, my: '2rem' }}>
        <Box display="flex" flexDirection="column" minHeight="100vh" mt="5rem" gap="2rem">
          {renderSurveysSection(
            'Your Active Surveys',
            <Done sx={{ color: 'green', width: '32px', height: '32px' }} />,
            survey => new Date(survey.closingTime) > new Date()
          )}
          {renderSurveysSection(
            'Your Inactive Surveys',
            <AlarmOn sx={{ color: 'crimson', width: '32px', height: '32px' }} />,
            survey => new Date(survey.closingTime) <= new Date()
          )}
        </Box>
      </Container>
    </>
  );
};
