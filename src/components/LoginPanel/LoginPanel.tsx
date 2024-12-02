import { Box, Typography, Stack, TextField, Button, Link } from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useAxios from '../../hooks/useAxios';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { setCookie } from 'typescript-cookie';

export const LoginPanel = () => {
  const { axiosRequest } = useAxios();

  const FormSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z.string().min(2, { message: 'Please enter a valid password.' }),
  });

  type Schema = z.infer<typeof FormSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Schema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: Schema) => {
    try {
      const response = await axiosRequest('POST', 'auth/authenticate', data);
      toast.success('Login successful!');
      setCookie('token', response?.data.access_token)
    } catch (err) {
      toast.error('Incorrect email or password!')
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
      <Typography component="h1" variant="h5">
        Sign in
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
            aria-label="email-field"
            required
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            id="email"
            label="Email"
            autoFocus
            {...register('email')}
          />
          <TextField
            aria-label="password-field"
            required
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            label="Password"
            type="password"
            id="password"
            {...register('password')}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ mt: 3, mb: 2, px: 8, backgroundColor: 'primary.600', borderRadius: '2rem' }}
          >
            Sign In
          </Button>
          <Link href="/register" variant="body1">
            Not a member? Register now!
          </Link>
        </Stack>
      </Box>
    </Box>
  );
};
