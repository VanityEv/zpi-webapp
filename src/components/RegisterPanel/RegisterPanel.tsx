import { Box, Typography, Stack, TextField, Button, Link } from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useAxios from '../../hooks/useAxios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setCookie } from 'typescript-cookie';
import { AxiosError } from 'axios';

export const RegisterPanel = () => {
  const { axiosRequest } = useAxios();

  const FormSchema = z.object({
    firstname: z.string().min(2, { message: 'Please enter a valid first name.' }),
    lastname: z.string().min(2, { message: 'Please enter a valid last name.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
  });

  type Schema = z.infer<typeof FormSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Schema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: Schema) => {
    try {
      const response = await axiosRequest('POST', 'auth/register', data);
      toast.success('Registration successful!');
      setCookie('token', response?.data.token);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error('Registration failed!');
      }
    }
  };

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
      <Typography component="h1" variant="h5" color="">
        Register
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
          <TextField
            aria-label="firstname-field"
            required
            error={Boolean(errors.firstname)}
            helperText={errors.firstname?.message}
            id="firstname"
            label="First Name"
            {...register('firstname')}
          />
          <TextField
            aria-label="lastname-field"
            required
            error={Boolean(errors.lastname)}
            helperText={errors.lastname?.message}
            id="lastname"
            label="Last Name"
            {...register('lastname')}
          />
          <TextField
            aria-label="email-field"
            required
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            id="email"
            label="Email"
            type="email"
            {...register('email')}
          />
          <TextField
            aria-label="password-field"
            required
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            id="password"
            label="Password"
            type="password"
            {...register('password')}
          />
          <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 3, mb: 2, px: 8 }}>
            Register
          </Button>
          <Link href="/login" variant="body1">
            Already have an account? Sign in!
          </Link>
        </Stack>
      </Box>
    </Box>
  );
};
