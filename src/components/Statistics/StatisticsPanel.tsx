import { Box, Typography } from '@mui/material';
import { SurveyCounter } from './SurverysCounter';
import AnswersChart from './AnswersChart';
import SurveysPerDayChart from './SurveyPerDayChart';
import QuestionList from './QuestionList';
import SurveyPieChart from './SurveyPieChart';
import { ApplicationBar } from '../AppBar/AppBar';
import useAxios from '../../hooks/useAxios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAuthHeader } from '../../utils/utils';
import { Question } from '../FormPanel/FormPanel';

export type DemographicDataType = {
  ageGroupDistribution: {
    [key: string]: number;
  };
  genderDistribution: {
    [key: string]: number;
  };
};

export type SummaryDataType = {
  avgResponsesPerDay: number;
  totalResponses: number;
  dailyResponses: {
    date: string;
    responseCount: number;
  }[];
};

export type AnswersDataType = {
  id: string;
  filledOutAt: string;
  formAnswers: { questionId: string; chosenAnswerIndexes: number[] }[];
  respondentData: {
    userEmail: string;
    birthdate: string;
    gender: string;
  };
}[];

export const StatisticsPanel = () => {
  const { axiosRequest } = useAxios();
  const [answersData, setAnswersData] = useState<AnswersDataType>([]);
  const [demographicData, setDemographicData] = useState<DemographicDataType>({} as DemographicDataType);
  const [summaryData, setSummaryData] = useState<SummaryDataType>({} as SummaryDataType);
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const params = useParams();
  const formId = params.formID;

  useEffect(() => {
    const fetchStatistics = async () => {
      const response = await axiosRequest('GET', `forms/${formId}/answers`, null, getAuthHeader());
      setAnswersData(response?.data);

      const summaryReponse = await axiosRequest('GET', `forms/${formId}/summary`, null, getAuthHeader());
      setSummaryData(summaryReponse?.data);

      const demographicResponse = await axiosRequest('GET', `forms/${formId}/demographic`, null, getAuthHeader());
      console.log(demographicResponse);
      setDemographicData(demographicResponse?.data);

      const questionListResponse = await axiosRequest('GET', `forms/${formId}`, null, getAuthHeader());
      setQuestionList(questionListResponse?.data.questions);
    };
    fetchStatistics();
  }, [axiosRequest, formId]);

  return (
    <>
      <ApplicationBar />
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
          <Typography textAlign="center">{formId}</Typography>
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
          <SurveyCounter
            avgResponsesPerDay={summaryData.avgResponsesPerDay}
            totalResponses={summaryData.totalResponses}
          />

          {summaryData.dailyResponses && <SurveysPerDayChart dailyResponses={summaryData.dailyResponses} />}

          {answersData && <AnswersChart answersData={answersData} />}

          {questionList && <QuestionList questions={questionList} />}

          {demographicData.genderDistribution && (
            <SurveyPieChart title="Gender of Respondents" data={demographicData.genderDistribution} />
          )}

          {demographicData.ageGroupDistribution && (
            <SurveyPieChart title="Age Group of Respondents" data={demographicData.ageGroupDistribution} />
          )}
        </Box>
      </Box>
    </>
  );
};
