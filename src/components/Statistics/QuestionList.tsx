import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
} from '@mui/material';
import { useState } from 'react';

type MultipleChoiceQuestion = {
  id: number;
  text: string;
  answers: string[];
};

type OpenEndedQuestion = {
  id: number;
  text: string;
};

export default function QuestionList() {
  const [viewType, setViewType] = useState<'multipleChoice' | 'openEnded'>('multipleChoice');

  const questions = {
    multipleChoice: [
      {
        id: 1,
        text: 'What is your favorite programming language?',
        answers: ['JavaScript', 'Python', 'Java', 'C#'],
      },
      {
        id: 2,
        text: 'How satisfied are you with our service?',
        answers: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'],
      },
      {
        id: 3,
        text: 'Which features do you use the most?',
        answers: ['Search', 'Recommendations', 'Reports', 'User Management'],
      },
      {
        id: 4,
        text: 'How often do you use our platform?',
        answers: ['Daily', 'Weekly', 'Monthly', 'Rarely'],
      },
      {
        id: 5,
        text: 'What is your preferred learning method?',
        answers: ['Videos', 'Articles', 'Interactive Tutorials', 'Webinars'],
      },
      {
        id: 6,
        text: 'How likely are you to recommend us?',
        answers: ['Very Likely', 'Likely', 'Neutral', 'Unlikely'],
      },
      {
        id: 7,
        text: 'What improvements can we make?',
        answers: ['Better Support', 'New Features', 'Improved UI', 'More Tutorials'],
      },
      {
        id: 8,
        text: 'What is your primary reason for using our platform?',
        answers: ['Work', 'Education', 'Hobby', 'Other'],
      },
      {
        id: 9,
        text: 'What do you value most about our service?',
        answers: ['Speed', 'Accuracy', 'Ease of Use', 'Customer Support'],
      },
      {
        id: 10,
        text: 'What additional tools would you like us to provide?',
        answers: ['Analytics', 'Scheduling', 'Collaboration', 'Export Options'],
      },
    ] as MultipleChoiceQuestion[],

    openEnded: [
      { id: 1, text: 'What do you think about our customer support?' },
      { id: 2, text: 'How can we improve our product?' },
      { id: 3, text: 'What additional features would you like to see?' },
      { id: 4, text: 'What is your overall experience with the platform?' },
      { id: 5, text: 'Please provide any other feedback.' },
    ] as OpenEndedQuestion[],
  };

  const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setViewType(event.target.value as 'multipleChoice' | 'openEnded');
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', my: 5 }}>
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
        Questions and Answers
      </Typography>

      <FormControl component="fieldset" sx={{ mb: 3, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <RadioGroup row aria-label="question type" value={viewType} onChange={handleViewChange}>
          <FormControlLabel value="multipleChoice" control={<Radio />} label="Multiple Choice" />
          <FormControlLabel value="openEnded" control={<Radio />} label="Open-Ended" />
        </RadioGroup>
      </FormControl>

      <Box
        sx={{
          height: 500,
          width: '100%',
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: 2,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <List>
          {(viewType === 'multipleChoice' ? questions.multipleChoice : questions.openEnded).map((question, index) => (
            <Box key={question.id}>
              <ListItem>
                <ListItemText primary={`Question ${index + 1}: ${question.text}`} />
              </ListItem>

              {viewType === 'multipleChoice' && (
                <List sx={{ pl: 4 }}>
                  {(question as MultipleChoiceQuestion).answers.map((answer, i) => (
                    <ListItem key={i} sx={{ display: 'list-item', py: 0 }}>
                      <ListItemText primary={`${String.fromCharCode(65 + i)}. ${answer}`} />
                    </ListItem>
                  ))}
                </List>
              )}

              {viewType === 'openEnded' && (
                <List sx={{ pl: 4 }}>
                  <ListItem>
                    <ListItemText primary="Your Answer:" />
                  </ListItem>
                </List>
              )}

              {index < (viewType === 'multipleChoice' ? questions.multipleChoice : questions.openEnded).length - 1 && (
                <Divider sx={{ my: 2 }} />
              )}
            </Box>
          ))}
        </List>
      </Box>
    </Box>
  );
}
