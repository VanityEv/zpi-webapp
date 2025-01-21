import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Divider } from '@mui/material';
import { ApplicationBar } from '../components/AppBar/AppBar';
import { getCookie } from 'typescript-cookie';
import { useCallback, useEffect, useState } from 'react';
import { Poll } from '@mui/icons-material';
import { AnswersOverview, AnswersOverviewProps } from '../components/AnswersOverview/AnswersOverview';
import useAxios from '../hooks/useAxios';
import { getAuthHeader } from '../utils/utils';

export const Responses = () => {
  const navigate = useNavigate();
  const { axiosRequest } = useAxios();
  const [userAnswers, setUserAnswers] = useState<AnswersOverviewProps[]>([]);

  const fetchUserAnswers = useCallback(async () => {
    try {
      const response = await axiosRequest('GET', 'forms/user-answered', null, getAuthHeader());
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
      if (userAnswers.length === 0) {
        const data = await fetchUserAnswers();
        setUserAnswers(data);
      }
    };
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchUserAnswers, navigate]);

  return (
    <>
      <ApplicationBar />
      <Container component="main" sx={{ mx: 0 }}>
        <Box display="flex" flexDirection="column" minHeight="100vh" mt="5rem" gap="2rem">
          <Typography
            variant="h4"
            gutterBottom
            sx={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'center' }}
          >
            <Poll sx={{ color: '#1976d2', width: '40px', height: '40px' }} />
            You Completed These Surveys:
          </Typography>
          <Divider sx={{ width: '100vw' }} />
          <Box
            sx={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr', md: '1fr 1fr 1fr 1fr 1fr 1fr' },
              gap: 4,
            }}
          >
            {userAnswers.map(answer => (
              <AnswersOverview
                key={`${answer.link + Math.random()}`}
                link={answer.link}
                title={answer.title}
                answerDate={answer.answerDate}
                creatorEmail={answer.creatorEmail}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </>
  );
};
