/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Typography, TextField, Button, IconButton, FormControlLabel, Switch, MenuItem } from '@mui/material';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface QuestionItemProps {
  control: any;
  register: any;
  questionIndex: number;
  field: any;
  removeQuestion: (index: number) => void;
  errors: any;
}

export function QuestionItem({ control, register, questionIndex, field, removeQuestion, errors }: QuestionItemProps) {
  const questionType = useWatch({
    control,
    name: `questions.${questionIndex}.questionType`,
    defaultValue: 'FREETEXT',
  });

  const {
    fields: possibleAnswers,
    append: addAnswer,
    remove: removeAnswer,
  } = useFieldArray({
    control,
    name: `questions.${questionIndex}.possibleAnswers`,
  });

  return (
    <Box key={field.id} sx={{ width: '100%', mb: 3 }}>
      {/* Question Text */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <TextField
          fullWidth
          required
          label={`Question ${questionIndex + 1}`}
          error={Boolean(errors.questions?.[questionIndex]?.questionText)}
          helperText={errors.questions?.[questionIndex]?.questionText?.message}
          {...register(`questions.${questionIndex}.questionText`)}
        />
        <IconButton
          aria-label="remove-question"
          color="error"
          onClick={() => removeQuestion(questionIndex)}
          sx={{ ml: 1 }}
        >
          <RemoveIcon />
        </IconButton>
      </Box>

      {/* Question Type Dropdown */}
      <Controller
        name={`questions.${questionIndex}.questionType`}
        control={control}
        defaultValue="FREETEXT"
        render={({ field }) => (
          <TextField select label="Question Type" {...field}>
            <MenuItem value="FREETEXT">Text Answer</MenuItem>
            <MenuItem value="SINGLE">Single Choice Answer</MenuItem>
            <MenuItem value="MULTIPLE">Multiple Choice Answer</MenuItem>
          </TextField>
        )}
      />

      {/* Required Switch */}
      <FormControlLabel
        control={
          <Controller
            name={`questions.${questionIndex}.required`}
            control={control}
            render={({ field: switchField }) => (
              <Switch checked={switchField.value} onChange={e => switchField.onChange(e.target.checked)} />
            )}
          />
        }
        label="Required"
        sx={{ mb: 2 }}
      />

      {/* Possible Answers (only for SINGLE or MULTIPLE question types) */}
      {questionType !== 'FREETEXT' && (
        <Box>
          <Typography variant="subtitle1">Possible Answers</Typography>
          {possibleAnswers.map((answer, answerIndex) => (
            <Box
              key={answer.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mt: 1,
              }}
            >
              <TextField
                fullWidth
                label={`Answer ${answerIndex + 1}`}
                error={Boolean(errors?.questions?.[questionIndex]?.possibleAnswers?.[answerIndex])}
                helperText={errors?.questions?.[questionIndex]?.possibleAnswers?.[answerIndex]?.message}
                {...register(`questions.${questionIndex}.possibleAnswers.${answerIndex}`)}
              />
              <IconButton
                aria-label="remove-answer"
                color="error"
                onClick={() => removeAnswer(answerIndex)}
                sx={{ ml: 1 }}
              >
                <RemoveIcon />
              </IconButton>
            </Box>
          ))}

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => addAnswer('')}
            color="success"
            sx={{ mt: 1, minWidth: '200px' }}
          >
            Add Possible Answer
          </Button>
        </Box>
      )}
    </Box>
  );
}
