import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  Select,
  MenuItem,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import useAxios from '../../hooks/useAxios';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { getAuthHeader } from '../../utils/utils';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface FormPanelProps {
  formID?: string;
}

export type Question = {
  id: string;
  questionType: 'FREETEXT' | 'SINGLE' | 'MULTIPLE';
  required: boolean;
  questionText: string;
  possibleAnswers: string[];
};

export type FormResponse = {
  link: string;
  title: string;
  closingTime: string;
  userEmail: string;
  questions: Question[];
  isPersonalDataRequired: boolean;
};

// Mark freetextAnswer as optional to match Zod's .optional()
type AnswerData = {
  questionId: string;
  freetextAnswer?: string;
  chosenAnswerIndexes: number[];
};

type FormInput = {
  answers: AnswerData[];
  birthDate?: string;
  gender?: string;
};

type SubmitPayload = {
  userEmail: string;
  birthDate?: string;
  gender?: string;
  answers: {
    questionId: string;
    freetextAnswer?: string;
    chosenAnswerIndexes?: number[];
  }[];
};

// We change the superRefine messages to "This field is required."
function buildFormSchema(questions: Question[], isPersonalDataRequired: boolean): ZodType<FormInput> {
  return z
    .object({
      birthDate: z.string().optional(),
      gender: z.string().optional(),
      answers: z.array(
        z.object({
          questionId: z.string(),
          freetextAnswer: z.string().optional(),
          chosenAnswerIndexes: z.array(z.number()),
        })
      ),
    })
    .superRefine((values, ctx) => {
      questions.forEach((q, i) => {
        const ans = values.answers[i];
        if (!ans) return;

        if (q.required) {
          if (q.questionType === 'FREETEXT') {
            // Must have non-empty text if required
            if (!ans.freetextAnswer || ans.freetextAnswer.trim() === '') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'This field is required.',
                path: ['answers', i, 'freetextAnswer'],
              });
            }
          } else {
            // SINGLE / MULTIPLE => at least one selection
            if (ans.chosenAnswerIndexes.length === 0) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'This field is required.',
                path: ['answers', i, 'chosenAnswerIndexes'],
              });
            }
          }
        }
      });

      // If personal data is required
      if (isPersonalDataRequired) {
        if (!values.birthDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'This field is required.',
            path: ['birthDate'],
          });
        }
        if (!values.gender) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'This field is required.',
            path: ['gender'],
          });
        }
      }
    });
}

export const FormPanel = ({ formID }: FormPanelProps) => {
  const { axiosRequest } = useAxios();
  const [formData, setFormData] = useState<FormResponse | null>(null);
  const [schema, setSchema] = useState<ZodType<FormInput> | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: { answers: [], birthDate: '', gender: '' },
    mode: 'onSubmit',
  });

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axiosRequest('GET', `forms/${formID}`, undefined, getAuthHeader());
        const data: FormResponse = response?.data;
        setFormData(data);

        // Initialize default answers
        const defaultAnswers = data.questions.map(q => ({
          questionId: q.id,
          freetextAnswer: '',
          chosenAnswerIndexes: [],
        }));
        setValue('answers', defaultAnswers);

        if (data.isPersonalDataRequired) {
          setValue('birthDate', '');
          setValue('gender', '');
        }

        // Build the schema dynamically
        const builtSchema = buildFormSchema(data.questions, data.isPersonalDataRequired);
        setSchema(builtSchema);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data || 'Failed to load form.');
        } else {
          toast.error('Failed to load form.');
        }
      }
    };
    if (formID) fetchForm();
  }, [formID, axiosRequest, setValue]);

  const onSubmit = async (data: FormInput) => {
    try {
      if (!formData) return;

      // Build final payload
      const payload: SubmitPayload = {
        userEmail: 'string', // Replace with actual userEmail if needed
        answers: formData.questions.map((q, i) => {
          const { freetextAnswer, chosenAnswerIndexes } = data.answers[i];
          if (q.questionType === 'FREETEXT') {
            return { questionId: q.id, freetextAnswer };
          }
          return { questionId: q.id, chosenAnswerIndexes };
        }),
      };

      if (formData.isPersonalDataRequired) {
        payload.birthDate = data.birthDate || '';
        payload.gender = data.gender || '';
      }

      await axiosRequest('POST', `forms/${formID}`, payload, getAuthHeader());
      toast.success('Form submitted successfully!');
      setIsFormSubmitted(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data || 'Failed to submit form.');
      } else {
        toast.error('Failed to submit form.');
      }
    }
  };

  if (!formData) {
    return (
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography>Loading form...</Typography>
      </Box>
    );
  }

  if (isFormSubmitted) {
    return (
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6" color="success.main" sx={{ mb: 2 }}>
          Your responses have been submitted successfully!
        </Typography>
        <Button variant="contained" color="primary" href="/" sx={{ mt: 2, px: 8 }}>
          Go to Home Page
        </Button>
      </Box>
    );
  }

  /**
   * Renders the error message above the input, right below the question text
   */
  const renderErrorAboveAnswers = (index: number, questionType: Question['questionType']) => {
    if (questionType === 'FREETEXT') {
      // If it's FREETEXT, check freetextAnswer errors
      if (errors.answers?.[index]?.freetextAnswer) {
        return (
          <Typography color="error" variant="body2" sx={{ mb: 1 }}>
            {errors.answers[index].freetextAnswer.message}
          </Typography>
        );
      }
    } else {
      // If it's SINGLE / MULTIPLE, check chosenAnswerIndexes errors
      if (errors.answers?.[index]?.chosenAnswerIndexes) {
        return (
          <Typography color="error" variant="body2" sx={{ mb: 1 }}>
            {errors.answers[index].chosenAnswerIndexes.message}
          </Typography>
        );
      }
    }
    return null;
  };

  // Render the question input
  const renderQuestionInput = (q: Question, index: number) => {
    if (q.questionType === 'FREETEXT') {
      return (
        <Controller
          name={`answers.${index}.freetextAnswer`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              required={q.required}
              placeholder="Type your answer here"
              error={Boolean(errors.answers?.[index]?.freetextAnswer)}
            />
          )}
        />
      );
    }

    if (q.questionType === 'SINGLE') {
      return (
        <Controller
          name={`answers.${index}.chosenAnswerIndexes`}
          control={control}
          render={({ field }) => {
            const selectedIndexes = field.value || [];
            const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              field.onChange([Number(e.target.value)]);
            };
            return (
              <RadioGroup value={selectedIndexes[0] ?? ''} onChange={handleRadioChange}>
                {q.possibleAnswers.map((ans, ansIndex) => (
                  <FormControlLabel key={ansIndex} value={ansIndex} control={<Radio />} label={ans} />
                ))}
              </RadioGroup>
            );
          }}
        />
      );
    }

    if (q.questionType === 'MULTIPLE') {
      return (
        <Controller
          name={`answers.${index}.chosenAnswerIndexes`}
          control={control}
          render={({ field }) => {
            const selectedIndexes = field.value || [];
            const handleCheckChange = (ansIndex: number) => {
              if (selectedIndexes.includes(ansIndex)) {
                field.onChange(selectedIndexes.filter(i => i !== ansIndex));
              } else {
                field.onChange([...selectedIndexes, ansIndex]);
              }
            };
            return (
              <FormGroup>
                {q.possibleAnswers.map((ans, ansIndex) => (
                  <FormControlLabel
                    key={ansIndex}
                    control={
                      <Checkbox
                        checked={selectedIndexes.includes(ansIndex)}
                        onChange={() => handleCheckChange(ansIndex)}
                      />
                    }
                    label={ans}
                  />
                ))}
              </FormGroup>
            );
          }}
        />
      );
    }

    return <Typography color="error">Unknown question type.</Typography>;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        mt: 3,
        m: 'auto',
        width: '100%',
        maxWidth: { xs: '85%', sm: '50%' },
        px: 2,
        minHeight: '100vh',
      }}
    >
      <Typography component="h1" variant="h5" sx={{ mt: 4, mb: 2, textAlign: 'center' }}>
        {formData.title}
      </Typography>

      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
        <Stack spacing={3} alignItems="stretch" mb={4}>
          {formData.isPersonalDataRequired && (
            <Box sx={{ width: '100%' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Personal Data
              </Typography>
              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label="Birth Date"
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(errors.birthDate)}
                    helperText={errors.birthDate?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select {...field} fullWidth displayEmpty error={Boolean(errors.gender)}>
                    <MenuItem value="">Select gender</MenuItem>
                    <MenuItem value="MALE">Male</MenuItem>
                    <MenuItem value="FEMALE">Female</MenuItem>
                  </Select>
                )}
              />
              {errors.gender && (
                <Typography color="error" variant="body2">
                  {errors.gender.message}
                </Typography>
              )}
            </Box>
          )}

          {formData.questions.map((question, index) => (
            <Box key={question.id} sx={{ width: '100%' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {index + 1}. {question.questionText}
              </Typography>

              {/* Show the error message right UNDER the question text, BEFORE the answers */}
              {renderErrorAboveAnswers(index, question.questionType)}

              {renderQuestionInput(question, index)}
            </Box>
          ))}

          <Box sx={{ mb: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                mt: 2,
                px: 8,
                width: { xs: '80%', sm: 'auto' },
                m: 'auto',
                display: 'block',
              }}
            >
              Submit
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};
