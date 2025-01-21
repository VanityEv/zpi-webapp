import { Box, Typography, Stack, TextField, Button, Link, FormControlLabel, Switch, Divider } from '@mui/material';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useAxios from '../../hooks/useAxios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AxiosError } from 'axios';
import AddIcon from '@mui/icons-material/Add';
import moment from 'moment';
import { DateTimePicker } from '@mui/x-date-pickers';
import { getAuthHeader, getUserEmail } from '../../utils/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { QuestionItem } from './Question';

export const CreateFormPanel = () => {
  const { axiosRequest } = useAxios();
  const navigate = useNavigate();

  const [isFormCreated, setIsFormCreated] = useState(false);
  const [formLink, setFormLink] = useState<string | null>(null);

  const now = new Date();
  const oneYearFromNow = new Date(now);
  oneYearFromNow.setFullYear(now.getFullYear() + 1);

  const FormSchema = z.object({
    title: z.string().min(2, { message: 'Please enter a valid title.' }),
    closingTime: z
      .date({ required_error: 'Please select a valid closing time.' })
      .refine(date => date > now, { message: 'Closing time must be in the future.' })
      .refine(date => date <= oneYearFromNow, {
        message: 'Closing time cannot be more than one year in the future.',
      }),
    isPersonalDataRequired: z.boolean(),
    questions: z
      .array(
        z.object({
          questionType: z.enum(['FREETEXT', 'SINGLE', 'MULTIPLE']),
          required: z.boolean(),
          questionText: z.string().min(1, { message: 'Question cannot be empty.' }),
          possibleAnswers: z.array(z.string()),
        })
      )
      .min(1, { message: 'At least one question is required.' }),
  });

  type FormInput = z.infer<typeof FormSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      closingTime: undefined,
      isPersonalDataRequired: false,
      questions: [
        {
          questionType: 'FREETEXT',
          required: false,
          questionText: '',
          possibleAnswers: [],
        },
      ],
    },
    mode: 'onSubmit',
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: 'questions',
  });

  const onSubmit = async (data: FormInput) => {
    try {
      const payload = {
        ...data,
        closingTime: data.closingTime.toISOString(),
        userEmail: getUserEmail(),
      };
      const response = await axiosRequest('POST', 'forms', payload, getAuthHeader());
      toast.success('Form created successfully!');
      setIsFormCreated(true);
      setFormLink(response?.data?.formLink);
    } catch (error) {
      const errorMessage = error instanceof AxiosError ? error.response?.data : 'Form creation failed!';
      toast.error(errorMessage);
    }
  };

  const handleCreateAnother = () => {
    reset();
    setIsFormCreated(false);
    setFormLink(null);
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  const renderSuccess = () => {
    const fullLink = formLink ? `${window.location.origin}/form/${formLink}` : null;

    return (
      <Stack spacing={3} textAlign="center">
        <Typography variant="h6" color="success.main">
          Your form was created successfully!
        </Typography>
        {fullLink && (
          <Typography>
            View your form:
            <Link href={fullLink} target="_blank" rel="noopener noreferrer">
              {fullLink}
            </Link>
          </Typography>
        )}
        <Box display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" color="primary" onClick={handleReturnHome}>
            Go to Home Page
          </Button>
          <Button variant="outlined" color="success" onClick={handleCreateAnother}>
            Create Another Form
          </Button>
        </Box>
      </Stack>
    );
  };

  // Render form inputs
  const renderForm = () => (
    <Stack spacing={3} width="100%">
      <TextField
        label="Title"
        required
        error={!!errors.title}
        helperText={errors.title?.message}
        {...register('title')}
      />

      <Controller
        name="closingTime"
        control={control}
        render={({ field }) => (
          <DateTimePicker
            label="Closing Time"
            slotProps={{
              textField: {
                error: !!errors.closingTime,
                helperText: errors.closingTime?.message,
              },
            }}
            value={field.value ? moment(field.value) : null}
            onChange={newValue => field.onChange(newValue?.toDate() ?? null)}
          />
        )}
      />

      <Controller
        name="isPersonalDataRequired"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Switch checked={field.value} onChange={field.onChange} />}
            label="Is Personal Data Required?"
          />
        )}
      />

      <Divider />

      <Typography variant="h6">Questions</Typography>
      {questionFields.map((field, index) => (
        <QuestionItem
          key={field.id}
          control={control}
          register={register}
          questionIndex={index}
          field={field}
          removeQuestion={removeQuestion}
          errors={errors}
        />
      ))}

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() =>
          appendQuestion({
            questionType: 'FREETEXT',
            required: false,
            questionText: '',
            possibleAnswers: [],
          })
        }
        color="success"
      >
        Add Question
      </Button>

      <Button type="submit" variant="contained" disabled={isSubmitting} fullWidth>
        Create Form
      </Button>
    </Stack>
  );

  // Component layout
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
        Create a New Form
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: { xs: '90%', md: '30%' },
          maxHeight: '80vh',
          overflowY: 'auto',
          p: 8,
          boxShadow: '0px 4px 12px rgba(25, 118, 210, 0.4)',
          borderRadius: '25px',
          backgroundColor: 'white',
        }}
      >
        {isFormCreated ? renderSuccess() : renderForm()}
      </Box>
    </Box>
  );
};
