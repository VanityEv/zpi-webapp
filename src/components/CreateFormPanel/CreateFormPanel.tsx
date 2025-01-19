import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Link,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  useForm,
  useFieldArray,
  Controller
} from 'react-hook-form';
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
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  // 1) The updated schema
  const FormSchema = z.object({
    title: z.string().min(2, { message: 'Please enter a valid title.' }),
    closingTime: z
      .date({ required_error: 'Please select a valid closing time.' })
      .refine((date) => date > now, { message: 'Closing time must be in the future.' })
      .refine((date) => date <= oneYearFromNow, {
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
        }),
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
      if (error instanceof AxiosError) {
        toast.error(error.response?.data);
      } else {
        toast.error('Form creation failed!');
      }
    }
  };

  const handleCreateAnother = () => {
    reset({
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
    });
    setIsFormCreated(false);
    setFormLink(null);
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  const renderSuccess = () => {
    const fullLink = formLink ? `${window.location.origin}/form/${formLink}` : null;

    return (
      <>
        <Typography variant="h6" color="success.main" sx={{ mb: 2 }}>
          Your form was created successfully!
        </Typography>
        {fullLink && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              You can view your form here:
            </Typography>
            <Typography>
              <Link href={fullLink} target="_blank" rel="noopener noreferrer">
                {fullLink}
              </Link>
            </Typography>
          </Box>
        )}
        <Button variant="contained" color="primary" onClick={handleReturnHome} sx={{ mr: 2 }}>
          Go to Home Page
        </Button>
        <Button variant="outlined" color="success" onClick={handleCreateAnother}>
          Create Another Form
        </Button>
      </>
    );
  };

  const renderForm = () => (
    <>
      <TextField
        aria-label="title-field"
        required
        error={Boolean(errors.title)}
        helperText={errors.title?.message}
        label="Title"
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
                error: Boolean(errors.closingTime),
                helperText: errors.closingTime?.message,
                required: true,
              },
            }}
            value={field.value ? moment(field.value) : null}
            onChange={(newValue) => {
              field.onChange(newValue?.toDate() ?? null);
            }}
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

      <Typography variant="h6" sx={{ mt: 2 }}>
        Questions
      </Typography>

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
        sx={{ minWidth: '200px' }}
      >
        Add Question
      </Button>

      <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 3, mb: 2, px: 8 }}>
        Create Form
      </Button>
    </>
  );

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
          mt: 3,
          pt: 2,
          pb: 8,
          pr: 2,
          width: { xs: '90%', md: '25%' },
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <Stack
          spacing={3}
          width="100%"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {isFormCreated ? renderSuccess() : renderForm()}
        </Stack>
      </Box>
    </Box>
  );
};
