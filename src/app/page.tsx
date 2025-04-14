'use client';

import { Box, Container, Typography, Grid, Card, CardContent, CardActions, Button, useTheme } from '@mui/material';
import { Extension, Grid3x3, GridOn } from '@mui/icons-material';
import Link from 'next/link';

export default function Home() {
  const theme = useTheme();

  const games = [
    {
      title: 'Mots Croisés',
      description: 'Testez votre vocabulaire et votre esprit de déduction avec nos grilles de mots croisés personnalisées.',
      icon: <Extension sx={{ fontSize: 40 }} />,
      href: '/mots-croises',
    },
    {
      title: 'Sudoku',
      description: 'Relevez le défi des chiffres avec nos grilles de Sudoku de différents niveaux de difficulté.',
      icon: <Grid3x3 sx={{ fontSize: 40 }} />,
      href: '/sudoku',
    },
    {
      title: 'Binero',
      description: 'Explorez la logique binaire avec ce puzzle captivant de 0 et de 1.',
      icon: <GridOn sx={{ fontSize: 40 }} />,
      href: '/binero',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        pt: 8,
        pb: 6,
        background: theme.palette.background.default,
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <Typography
            component="h1"
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Bienvenue sur Logica
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Exercez votre esprit avec notre collection de jeux de logique
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 4,
          }}
        >
          {games.map((game) => (
            <Box key={game.title}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 2, color: 'primary.main' }}>{game.icon}</Box>
                  <Typography gutterBottom variant="h5" component="h2">
                    {game.title}
                  </Typography>
                  <Typography color="text.secondary">{game.description}</Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    component={Link}
                    href={game.href}
                    variant="contained"
                    color="primary"
                    sx={{
                      borderRadius: '20px',
                      px: 4,
                    }}
                  >
                    Jouer
                  </Button>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
