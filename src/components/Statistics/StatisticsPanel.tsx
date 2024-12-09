import { Box, Typography } from "@mui/material"
import { SurveyCounter } from "./SurverysCounter"
import AnswersChart from "./AnswersChart"
import SurveysPerDayChart from "./SurveyPerDayChart"
import QuestionList from "./QuestionList"
import SurveyPieChart from "./SurveyPieChart"
import { ageData, genderData } from "./pieChart.data"


export const StatisticsPanel = () => {

  return (
    <Box sx={{display:'flex', flexDirection:'column', height:'auto', justifyContent:'center', alignItems:'center', m:'6rem', '&>*': {px:'5rem'}}}>
    <Box>
          <Typography variant='h4' textAlign='center'>Survey Statistics</Typography>
      <Typography textAlign='center'>Test title #1</Typography>
      </Box>
        <Box
      sx={{ height:'100%', width:'100%', display: 'grid', gap:'3rem', gridTemplateColumns: '50% 50%', position:'relative' }}
    >
    <SurveyCounter/>    
      <SurveysPerDayChart/>
    <AnswersChart/>
    <QuestionList/>
    <SurveyPieChart title="Gender of respondents" data={genderData}/>
    <SurveyPieChart title="Age group of respondents" data={ageData}/>
    </Box>
    </Box>
  )
}