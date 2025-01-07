import { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { LogoutButton } from '../LogoutButton/LogoutButton';
import { getCookie } from 'typescript-cookie';

export const ApplicationBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: 'My Surveys', href: '/' },
    { label: 'My Responses', href: '/responses' },
    { label: 'Create Survey', href: '/form/create' },
    { label: 'Logout', component: <LogoutButton /> },
  ];

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '75vw' }}
    >
      <Typography variant="h6" sx={{ my: 2 }}>
        Survey App
      </Typography>
      <List>
        {navItems.map((item, index) =>
          item.component ? (
            <ListItem key={index} sx={{ justifyContent: 'center' }}>
              {item.component}
            </ListItem>
          ) : (
            <ListItem key={index} component="a" href={item.href} sx={{ textAlign: 'center' }}>
              <ListItemText primary={item.label} sx={{ fontWeight: '800', color: 'black' }} />
            </ListItem>
          )
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            Survey App
          </Typography>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 3 }}>
            {getCookie('role') === 'ADMIN' && (
              <Button key={'manage-users'} href={'/manage-users'} sx={{ ':hover': { color: 'white' } }}>
                Manage Users
              </Button>
            )}
            {navItems.map((item, index) =>
              item.component ? (
                <Box key={index}>{item.component}</Box>
              ) : (
                <Button key={index} href={item.href} sx={{ ':hover': { color: 'white' } }}>
                  {item.label}
                </Button>
              )
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }}>
        {drawer}
      </Drawer>
    </Box>
  );
};
