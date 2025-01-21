import { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  InputLabel,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { FormResponse } from '../components/FormPanel/FormPanel';
import { AnswersDataType } from '../components/Statistics/StatisticsPanel';

interface SurveyViewerProps {
  questions: FormResponse;
  answersData: AnswersDataType[];
  readOnly: boolean;
  requestedByUser?:boolean
}

export const SurveyViewer = ({ questions, answersData, readOnly, requestedByUser }: SurveyViewerProps) => {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(answersData[0].respondentData.userEmail);

  const emails = Array.from(new Set(answersData.map(answer => answer.respondentData.userEmail)));

const getAnswerForQuestion = (
  questionId: string,
  email: string,
  questionType: 'SINGLE' | 'MULTIPLE' | 'FREETEXT'
) => {
  const answer = answersData.find(
    a => a.respondentData.userEmail === email && a.formAnswers.some(fa => fa.questionId === questionId)
  );

  if (!answer) {
    return questionType === 'FREETEXT' ? '' : []; 
  }

  const formAnswer = answer.formAnswers.find(fa => fa.questionId === questionId);

  if (!formAnswer) {
    return questionType === 'FREETEXT' ? '' : []; 
  }

  if (questionType === 'SINGLE' || questionType === 'MULTIPLE') {
    return formAnswer.chosenAnswerIndexes ?? []; 
  } else if (questionType === 'FREETEXT') {
    return formAnswer.freetextAnswer || ''; 
  }

  return ''; 
};



  const handleEmailChange = (value: string) => {
    setSelectedEmail(value);
  };

  return (
    <Box sx={{ width: '80%', maxWidth: 1200, padding: 2 }}>
      <Card sx={{ marginBottom: 3, boxShadow: '0px 4px 12px rgba(25, 118, 210, 0.4)', borderRadius: '25px' }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: '2rem' }}>
            {requestedByUser ? 'Survey Response': 'Survey Responses'}
          </Typography>
          {!requestedByUser && (
          <FormControl fullWidth sx={{ marginBottom: 3 }}>
            <InputLabel>Select an Email</InputLabel>
            <Select
              value={selectedEmail || ''}
              label="Select an Email"
              onChange={event => handleEmailChange(event.target.value)}
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: 1,
                },
              }}
            >
              {emails.map(email => (
                <MenuItem key={email} value={email}>
                  {email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          )}

          <Divider sx={{ marginBottom: 2 }} />

          {selectedEmail && (
            <Box>
              {questions.questions.map(question => (
                <Box key={question.id} sx={{ marginBottom: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {question.questionText}
                  </Typography>

                {question.questionType === 'SINGLE' && (
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      value={getAnswerForQuestion(question.id, selectedEmail, question.questionType)?.toString() || '-1'}
                    >
                      {question.possibleAnswers.map((answer, index) => (
                        <FormControlLabel
                          key={index}
                          value={index.toString()}
                          control={<Radio disabled={readOnly} />}
                          label={answer}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}    

                {question.questionType === 'MULTIPLE' && (
                  <FormControl component="fieldset" fullWidth>
                    {question.possibleAnswers.map((answer, index) => (
                      <FormControlLabel
                        key={index}
                        control={
                          <Checkbox
                            checked={(getAnswerForQuestion(question.id, selectedEmail, question.questionType) as number[]).includes(index)}
                            disabled={readOnly}
                          />
                        }
                        label={answer}
                      />
                    ))}
                  </FormControl>
                )}

                {question.questionType === 'FREETEXT' && (
                  <Box>
                    <Typography variant="body1" color="textSecondary">
                      {getAnswerForQuestion(question.id, selectedEmail, question.questionType) || 'No answer provided'}
                    </Typography>
                  </Box>
                )}
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SurveyViewer;
