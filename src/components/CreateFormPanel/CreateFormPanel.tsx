import { Box, Typography, Stack, TextField, Button, IconButton } from '@mui/material';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useAxios from '../../hooks/useAxios';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { AxiosError } from 'axios';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { DateTimePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import { getAuthHeader } from '../../utils/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CreateFormPanel = () => {
    const { axiosRequest } = useAxios();
    const navigate = useNavigate();
    const [isFormCreated, setIsFormCreated] = useState(false);

    const now = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    const FormSchema = z.object({
        title: z.string().min(2, { message: 'Please enter a valid title.' }),
        closingTime: z.date({ required_error: 'Please select a valid closing time.' })
            .refine(
                (date) => date > now,
                { message: 'Closing time must be in the future.' }
            )
            .refine(
                (date) => date <= oneYearFromNow,
                { message: 'Closing time cannot be more than one year in the future.' }
            ),
        questions: z.array(
            z.object({
                value: z.string().min(1, { message: 'Question cannot be empty.' })
            })
        ).min(1, { message: 'At least one question is required.' })
    });

    type FormInput = z.infer<typeof FormSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
        reset
    } = useForm<FormInput>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: '',
            closingTime: undefined,
            questions: [{ value: '' }]
        },
        mode: 'onSubmit',
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'questions'
    });

    const onSubmit = async (data: FormInput) => {
        try {
            const payload = {
                ...data,
                closingTime: data.closingTime.toISOString(),
                questions: data.questions.map(q => q.value),
            };
            await axiosRequest("POST", "forms", payload, getAuthHeader());
            toast.success("Form created successfully!");
            setIsFormCreated(true);
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data);
            } else {
                toast.error("Form creation failed!");
            }
        }
    };

    const handleCreateAnother = () => {
        reset({
            title: '',
            closingTime: undefined,
            questions: [{ value: '' }]
        });
        setIsFormCreated(false);
    }

    const handleReturnHome = () => {
        navigate('/');
    }

    const renderSuccess = () => (
        <>
            <Typography variant="h6" color="success.main">
                Your form was created successfully!
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleReturnHome}
            >
                Go to Home Page
            </Button>
            <Button
                variant="outlined"
                color="success"
                onClick={handleCreateAnother}
            >
                Create Another Form
            </Button>
        </>
    )

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
                            }
                        }}
                        value={field.value ? moment(field.value) : null}
                        onChange={(newValue) => {
                            field.onChange(newValue?.toDate() ?? null);
                        }}
                    />
                )}
            />

            <Typography variant="h6">Questions</Typography>

            {fields.map((field, index) => (
                <Box key={field.id} sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                    <TextField
                        fullWidth
                        required
                        error={Boolean(errors.questions?.[index]?.value)}
                        helperText={errors.questions?.[index]?.value?.message}
                        label={`Question ${index + 1}`}
                        {...register(`questions.${index}.value`)}
                    />
                    {fields.length > 1 && (
                        <IconButton
                            aria-label="remove-question"
                            color="error"
                            onClick={() => remove(index)}
                            sx={{ ml: 1 }}
                        >
                            <RemoveIcon />
                        </IconButton>
                    )}
                </Box>
            ))}

            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => append({ value: '' })}
                color="success"
            >
                Add Question
            </Button>

            <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{ mt: 3, mb: 2, px: 8 }}
            >
                Create Form
            </Button>
        </>
    )

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
            <Typography component="h1" variant="h5">
                Create a New Form
            </Typography>
            <Box
                component="form"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                sx={{ mt: 3, pb: 2, width: { xs: '75%', md: '20%' } }}
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
                    {isFormCreated
                        ? renderSuccess()
                        : renderForm()
                    }
                </Stack>
            </Box>
        </Box>
    );
};
