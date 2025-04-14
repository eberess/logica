'use client';

import { AppBar, Toolbar, Typography, IconButton, useTheme, Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Brightness4, Brightness7, Menu, Extension, Grid3x3, GridOn } from '@mui/icons-material';
import { useContext, useState } from 'react';
import Link from 'next/link';
import { ColorModeContext } from '@/context/ColorModeContext';

export const Navbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuItems = [
    { title: 'Mots Croisés', icon: <Extension />, href: '/mots-croises' },
    { title: 'Sudoku', icon: <Grid3x3 />, href: '/sudoku' },
    { title: 'Binero', icon: <GridOn />, href: '/binero' },
  ];

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { sm: 'none' } }}
            onClick={() => setDrawerOpen(true)}
          >
            <Menu />
          </IconButton>
          
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            LOGICA
          </Typography>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2, alignItems: 'center' }}>
            {menuItems.map((item) => (
              <Typography
                key={item.title}
                component={Link}
                href={item.href}
                sx={{ textDecoration: 'none', color: 'inherit' }}
              >
                {item.title}
              </Typography>
            ))}
          </Box>

          <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <List sx={{ width: 250 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.title}
              component={Link}
              href={item.href}
              onClick={() => setDrawerOpen(false)}
              sx={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}; 