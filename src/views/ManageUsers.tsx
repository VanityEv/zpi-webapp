import { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  IconButton,
} from '@mui/material';
import useAxios from '../hooks/useAxios';
import { ApplicationBar } from '../components/AppBar/AppBar';
import { getAuthHeader } from '../utils/utils';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { KeyboardDoubleArrowUp, Delete } from '@mui/icons-material';
import { getCookie } from 'typescript-cookie';
import { useNavigate } from 'react-router-dom';

type UserEntry = {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
};

export const ManageUsers = () => {
  const [users, setUsers] = useState<UserEntry[]>([]);
  const { axiosRequest } = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    if(!getCookie('token') || !(getCookie('role') === 'ADMIN')) {
      toast.error('Unauthorized!')
      navigate('/')
      return;
    }
    const fetchUsers = async () => {
      try {
        const response = await axiosRequest('GET', 'admin/users', null, getAuthHeader());
        if (!response?.status) {
          throw new Error(`HTTP error! Status: ${response?.status}`);
        }
        const data = await response.data;
        setUsers(data.users);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error('Error occurred while fetching users data');
        }
      }
    };
    fetchUsers();
  }, [axiosRequest, navigate]);

  const promoteUser = async (email: string) => {
    try {
      const response = await axiosRequest('PATCH', `admin/users/promote/${email}`, null, getAuthHeader());
      if (response?.status === 200) {
        toast.success(`${email} has been promoted to admin.`);
        setUsers(prevUsers => prevUsers.map(user => (user.email === email ? { ...user, role: 'ADMIN' } : user)));
      } else {
        toast.error(`Failed to promote ${email}.`);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error('Error occurred while promoting user.');
      }
    }
  };

  const deleteUser = async (email: string) => {
    try {
      const response = await axiosRequest('DELETE', `admin/users/${email}`, null, getAuthHeader());
      if (response?.status === 204) {
        toast.success('User account deleted successfully.');
        setUsers(prevUsers => prevUsers.filter(user => user.email !== email));
      } else {
        toast.error('Failed to delete user account.');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error('Error occurred while deleting user account.');
      }
    }
  };

  return (
    <>
      <ApplicationBar />
      <Box p={3} mt="5rem">
        <Typography variant="h4" gutterBottom>
          Manage Users
        </Typography>
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 700,
            overflow: 'auto',
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.role === 'USER' && (
                      <IconButton onClick={() => promoteUser(user.email)}>
                        <KeyboardDoubleArrowUp sx={{ color: 'green', mr: 2 }} />
                        <Typography variant="body1">Promote</Typography>
                      </IconButton>
                    )}
                    {user.role === 'ADMIN' && (
                      <IconButton disabled>
                        <KeyboardDoubleArrowUp sx={{ mr: 2 }} />
                        <Typography variant="body1">Promote</Typography>
                      </IconButton>
                    )}
                  </TableCell>
                  {user.role === 'USER' ? (
                    <TableCell>
                      <IconButton onClick={() => deleteUser(user.email)}>
                        <Delete sx={{ color: 'red', mr: 2 }} />
                        <Typography variant="body1">Delete</Typography>
                      </IconButton>
                    </TableCell>
                  ) : (
                    <TableCell>
                      <IconButton disabled>
                        <Delete sx={{ mr: 2 }} />
                        <Typography variant="body1">Delete</Typography>
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};
