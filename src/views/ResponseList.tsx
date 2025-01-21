import { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress, Box, Typography } from '@mui/material';
import { SurveyViewer } from './SurveyViewer';
import { AnswersDataType } from '../components/Statistics/StatisticsPanel';
import { FormResponse } from '../components/FormPanel/FormPanel';
import useAxios from '../hooks/useAxios';
import { useParams } from 'react-router-dom';
import { getAuthHeader } from '../utils/utils';
import { ApplicationBar } from '../components/AppBar/AppBar';
import { toast } from 'react-toastify';

const ResponseList = () => {
  const [questions, setQuestions] = useState<FormResponse>({} as FormResponse);
  const [answersData, setAnswersData] = useState<AnswersDataType>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const { axiosRequest } = useAxios();
  const params = useParams();
  const formId = params.formID;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const questionListResponse = await axiosRequest('GET', `forms/${formId}`, null, getAuthHeader());
        setQuestions(questionListResponse?.data);

        const answersResponse = await axiosRequest('GET', `forms/${formId}/answers`, null, getAuthHeader());
        setAnswersData(answersResponse?.data);

        setLoading(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error('Error fetching response data!');
          setError(error.message);
        } else {
          setError('An error occurred');
        }
      }
    };

    fetchData();
  }, [axiosRequest, formId]);

  if (loading) {
    return (
      <>
        <ApplicationBar />
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
          <Typography variant="body1" sx={{ marginLeft: 2 }}>
            Loading data...
          </Typography>
        </Box>
      </>
    );
  }

  if (error) {
    return (
      <>
        <ApplicationBar />
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <ApplicationBar />
      <Box display="flex" justifyContent="center" alignItems="center" width="100%" mt="5rem">
        <SurveyViewer questions={questions} answersData={answersData} readOnly={true} />
      </Box>
    </>
  );
};

export default ResponseList;
