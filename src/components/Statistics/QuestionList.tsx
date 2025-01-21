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
import { Question } from '../FormPanel/FormPanel';

export default function QuestionList({ questions }: { questions: Question[] }) {
  const [viewType, setViewType] = useState<'SINGLE' | 'MULTIPLE' | 'FREETEXT'>('SINGLE');

  const filteredQuestions = questions.filter(
    q =>
      (q.questionType === 'SINGLE' && viewType === 'SINGLE') ||
      (q.questionType === 'MULTIPLE' && viewType === 'MULTIPLE') ||
      (q.questionType === 'FREETEXT' && viewType === 'FREETEXT')
  );

  const hasSingle = questions.some(q => q.questionType === 'SINGLE');
  const hasMultiple = questions.some(q => q.questionType === 'MULTIPLE');
  const hasFreeText = questions.some(q => q.questionType === 'FREETEXT');

  const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setViewType(event.target.value as 'SINGLE' | 'MULTIPLE' | 'FREETEXT');
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', my: 5 }}>
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
        Questions and Answers
      </Typography>

      <FormControl component="fieldset" sx={{ mb: 3, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <RadioGroup row aria-label="question type" value={viewType} onChange={handleViewChange}>
          <FormControlLabel value="SINGLE" control={<Radio />} label="Single Choice" disabled={!hasSingle} />
          <FormControlLabel value="MULTIPLE" control={<Radio />} label="Multiple Choice" disabled={!hasMultiple} />
          <FormControlLabel value="FREETEXT" control={<Radio />} label="Free Text" disabled={!hasFreeText} />
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
          {filteredQuestions.map((question, index) => (
            <Box key={question.id}>
              <ListItem>
                <ListItemText primary={`Question: ${question.questionText}`} />
              </ListItem>

              {question.questionType === 'SINGLE' && (
                <List sx={{ pl: 4 }}>
                  {question.possibleAnswers.map((answer, i) => (
                    <ListItem key={i} sx={{ display: 'list-item', py: 0 }}>
                      <ListItemText primary={`${String.fromCharCode(65 + i)}. ${answer}`} />
                    </ListItem>
                  ))}
                </List>
              )}

              {question.questionType === 'MULTIPLE' && (
                <List sx={{ pl: 4 }}>
                  {question.possibleAnswers.map((answer, i) => (
                    <ListItem key={i} sx={{ display: 'list-item', py: 0 }}>
                      <ListItemText primary={`${String.fromCharCode(65 + i)}. ${answer}`} />
                    </ListItem>
                  ))}
                </List>
              )}

              {question.questionType === 'FREETEXT' && (
                <ListItem sx={{ pl: 4 }}>
                  <ListItemText primary="Free Text Question (type your answer)" />
                </ListItem>
              )}

              {index < filteredQuestions.length - 1 && <Divider sx={{ my: 2 }} />}
            </Box>
          ))}
        </List>
      </Box>
    </Box>
  );
}
