'use client';

import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Paper, useTheme } from '@mui/material';
import { Check, Close, Info } from '@mui/icons-material';

export const BineroRules = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="body1" paragraph>
        Le Binero est un jeu de logique où vous devez remplir une grille avec des 0 et des 1 en respectant trois règles :
      </Typography>
      <Box component="ul" sx={{ pl: 2, mb: 2 }}>
        <Typography component="li" variant="body1" paragraph>
          Chaque ligne et chaque colonne doit contenir un nombre égal de 0 et de 1.
        </Typography>
        <Typography component="li" variant="body1" paragraph>
          Il ne peut pas y avoir plus de deux chiffres identiques côte à côte (horizontalement ou verticalement).
        </Typography>
        <Typography component="li" variant="body1" paragraph>
          Deux lignes ou deux colonnes ne peuvent pas être identiques.
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">
        Cliquez sur une case pour alterner entre 0, 1 et vide. Double-cliquez pour effacer la valeur.
      </Typography>
    </Box>
  );
}; 