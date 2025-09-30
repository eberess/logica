import { CrosswordGrid } from '@/types/crossword';

export const crosswordGrids: CrosswordGrid[] = [
  {
    id: 'facile-1',
    name: 'Animaux domestiques',
    difficulty: 'facile',
    size: { rows: 5, cols: 5 },
    cells: [
      [
        { letter: 'C', number: 1, isBlack: false, userInput: '' },
        { letter: 'H', isBlack: false, userInput: '' },
        { letter: 'A', isBlack: false, userInput: '' },
        { letter: 'T', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ],
      [
        { letter: 'H', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: 'M', number: 2, isBlack: false, userInput: '' },
        { letter: 'A', isBlack: false, userInput: '' },
        { letter: 'I', isBlack: false, userInput: '' }
      ],
      [
        { letter: 'I', isBlack: false, userInput: '' },
        { letter: 'E', number: 3, isBlack: false, userInput: '' },
        { letter: 'A', isBlack: false, userInput: '' },
        { letter: 'U', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ],
      [
        { letter: 'E', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: 'R', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ],
      [
        { letter: 'N', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: 'S', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ]
    ],
    clues: [
      { number: 1, direction: 'horizontal', clue: 'Animal domestique félin', answer: 'CHAT', startRow: 0, startCol: 0, length: 4 },
      { number: 1, direction: 'vertical', clue: 'Animal domestique fidèle', answer: 'CHIEN', startRow: 0, startCol: 0, length: 5 },
      { number: 2, direction: 'horizontal', clue: 'Mois de printemps', answer: 'MAI', startRow: 1, startCol: 2, length: 3 },
      { number: 3, direction: 'horizontal', clue: 'Liquide vital', answer: 'EAU', startRow: 2, startCol: 1, length: 3 },
    ]
  },
  {
    id: 'facile-2',
    name: 'Couleurs',
    difficulty: 'facile',
    size: { rows: 5, cols: 5 },
    cells: [
      [
        { letter: 'R', number: 1, isBlack: false, userInput: '' },
        { letter: 'O', isBlack: false, userInput: '' },
        { letter: 'U', isBlack: false, userInput: '' },
        { letter: 'G', isBlack: false, userInput: '' },
        { letter: 'E', isBlack: false, userInput: '' }
      ],
      [
        { letter: 'O', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: 'U', isBlack: false, userInput: '' }
      ],
      [
        { letter: 'S', isBlack: false, userInput: '' },
        { letter: 'O', number: 2, isBlack: false, userInput: '' },
        { letter: 'L', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: 'R', isBlack: false, userInput: '' }
      ],
      [
        { letter: 'E', isBlack: false, userInput: '' },
        { letter: 'R', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: 'B', number: 3, isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ],
      [
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: 'L', isBlack: false, userInput: '' },
        { letter: 'E', isBlack: false, userInput: '' }
      ]
    ],
    clues: [
      { number: 1, direction: 'horizontal', clue: 'Couleur du sang', answer: 'ROUGE', startRow: 0, startCol: 0, length: 5 },
      { number: 1, direction: 'vertical', clue: 'Couleur de la fleur', answer: 'ROSE', startRow: 0, startCol: 0, length: 4 },
      { number: 2, direction: 'horizontal', clue: 'Astre du jour', answer: 'SOL', startRow: 2, startCol: 1, length: 3 },
      { number: 3, direction: 'vertical', clue: 'Couleur du ciel', answer: 'BLEU', startRow: 3, startCol: 3, length: 2 },
    ]
  },
  {
    id: 'facile-3',
    name: 'Nourriture',
    difficulty: 'facile',
    size: { rows: 5, cols: 5 },
    cells: [
      [
        { letter: 'P', number: 1, isBlack: false, userInput: '' },
        { letter: 'A', isBlack: false, userInput: '' },
        { letter: 'I', isBlack: false, userInput: '' },
        { letter: 'N', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ],
      [
        { letter: 'O', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: 'T', number: 2, isBlack: false, userInput: '' }
      ],
      [
        { letter: 'M', isBlack: false, userInput: '' },
        { letter: 'I', number: 3, isBlack: false, userInput: '' },
        { letter: 'E', isBlack: false, userInput: '' },
        { letter: 'L', isBlack: false, userInput: '' },
        { letter: 'H', isBlack: false, userInput: '' }
      ],
      [
        { letter: 'M', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: 'E', isBlack: false, userInput: '' }
      ],
      [
        { letter: 'E', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ]
    ],
    clues: [
      { number: 1, direction: 'horizontal', clue: 'Aliment de base', answer: 'PAIN', startRow: 0, startCol: 0, length: 4 },
      { number: 1, direction: 'vertical', clue: 'Fruit rouge', answer: 'POMME', startRow: 0, startCol: 0, length: 5 },
      { number: 2, direction: 'vertical', clue: 'Boisson chaude', answer: 'THE', startRow: 1, startCol: 4, length: 3 },
      { number: 3, direction: 'horizontal', clue: 'Produit des abeilles', answer: 'MIEL', startRow: 2, startCol: 1, length: 4 },
    ]
  }, 
 {
    id: 'moyen-1',
    name: 'Géographie',
    difficulty: 'moyen',
    size: { rows: 7, cols: 7 },
    cells: [
      [
        { letter: 'F', number: 1, isBlack: false, userInput: '' },
        { letter: 'R', isBlack: false, userInput: '' },
        { letter: 'A', isBlack: false, userInput: '' },
        { letter: 'N', isBlack: false, userInput: '' },
        { letter: 'C', isBlack: false, userInput: '' },
        { letter: 'E', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ],
      [
        { letter: 'L', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: 'U', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ],
      [
        { letter: 'E', isBlack: false, userInput: '' },
        { letter: 'S', number: 2, isBlack: false, userInput: '' },
        { letter: 'P', isBlack: false, userInput: '' },
        { letter: 'A', isBlack: false, userInput: '' },
        { letter: 'G', isBlack: false, userInput: '' },
        { letter: 'N', isBlack: false, userInput: '' },
        { letter: 'E', isBlack: false, userInput: '' }
      ],
      [
        { letter: 'U', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: 'E', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ],
      [
        { letter: 'V', isBlack: false, userInput: '' },
        { letter: 'I', number: 3, isBlack: false, userInput: '' },
        { letter: 'L', isBlack: false, userInput: '' },
        { letter: 'L', isBlack: false, userInput: '' },
        { letter: 'E', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ],
      [
        { letter: 'E', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ],
      [
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ]
    ],
    clues: [
      { number: 1, direction: 'horizontal', clue: 'Pays de la tour Eiffel', answer: 'FRANCE', startRow: 0, startCol: 0, length: 6 },
      { number: 1, direction: 'vertical', clue: 'Cours d\'eau', answer: 'FLEUVE', startRow: 0, startCol: 0, length: 6 },
      { number: 2, direction: 'horizontal', clue: 'Pays de la paella', answer: 'ESPAGNE', startRow: 2, startCol: 1, length: 7 },
      { number: 3, direction: 'horizontal', clue: 'Agglomération urbaine', answer: 'VILLE', startRow: 4, startCol: 1, length: 5 },
    ]
  },
  {
    id: 'moyen-2',
    name: 'Sciences',
    difficulty: 'moyen',
    size: { rows: 6, cols: 6 },
    cells: [
      [
        { letter: 'T', number: 1, isBlack: false, userInput: '' },
        { letter: 'E', isBlack: false, userInput: '' },
        { letter: 'R', isBlack: false, userInput: '' },
        { letter: 'R', isBlack: false, userInput: '' },
        { letter: 'E', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ],
      [
        { letter: 'E', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: 'A', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ],
      [
        { letter: 'M', isBlack: false, userInput: '' },
        { letter: 'A', number: 2, isBlack: false, userInput: '' },
        { letter: 'R', isBlack: false, userInput: '' },
        { letter: 'S', isBlack: false, userInput: '' },
        { letter: 'U', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ],
      [
        { letter: 'P', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: 'O', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ],
      [
        { letter: 'S', isBlack: false, userInput: '' },
        { letter: 'O', number: 3, isBlack: false, userInput: '' },
        { letter: 'L', isBlack: false, userInput: '' },
        { letter: 'E', isBlack: false, userInput: '' },
        { letter: 'I', isBlack: false, userInput: '' },
        { letter: 'L', isBlack: false, userInput: '' }
      ],
      [
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ]
    ],
    clues: [
      { number: 1, direction: 'horizontal', clue: 'Troisième planète du système solaire', answer: 'TERRE', startRow: 0, startCol: 0, length: 5 },
      { number: 1, direction: 'vertical', clue: 'Mesure de chaleur', answer: 'TEMPS', startRow: 0, startCol: 0, length: 5 },
      { number: 2, direction: 'horizontal', clue: 'Planète rouge', answer: 'MARS', startRow: 2, startCol: 1, length: 4 },
      { number: 3, direction: 'horizontal', clue: 'Astre du jour', answer: 'SOLEIL', startRow: 4, startCol: 1, length: 6 },
    ]
  },
  {
    id: 'difficile-1',
    name: 'Histoire',
    difficulty: 'difficile',
    size: { rows: 8, cols: 9 },
    cells: [
      [
        { letter: 'N', number: 1, isBlack: false, userInput: '' },
        { letter: 'A', isBlack: false, userInput: '' },
        { letter: 'P', isBlack: false, userInput: '' },
        { letter: 'O', isBlack: false, userInput: '' },
        { letter: 'L', isBlack: false, userInput: '' },
        { letter: 'E', isBlack: false, userInput: '' },
        { letter: 'O', isBlack: false, userInput: '' },
        { letter: 'N', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ],
      [
        { letter: 'O', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ],
      [
        { letter: 'B', isBlack: false, userInput: '' },
        { letter: 'A', number: 2, isBlack: false, userInput: '' },
        { letter: 'S', isBlack: false, userInput: '' },
        { letter: 'T', isBlack: false, userInput: '' },
        { letter: 'I', isBlack: false, userInput: '' },
        { letter: 'L', isBlack: false, userInput: '' },
        { letter: 'L', isBlack: false, userInput: '' },
        { letter: 'E', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ],
      [
        { letter: 'L', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ],
      [
        { letter: 'E', isBlack: false, userInput: '' },
        { letter: 'M', number: 3, isBlack: false, userInput: '' },
        { letter: 'P', isBlack: false, userInput: '' },
        { letter: 'I', isBlack: false, userInput: '' },
        { letter: 'R', isBlack: false, userInput: '' },
        { letter: 'E', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ],
      [
        { letter: 'S', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ],
      [
        { letter: 'S', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ],
      [
        { letter: 'E', isBlack: false, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' },
        { letter: '', isBlack: true, userInput: '' }
      ]
    ],
    clues: [
      { number: 1, direction: 'horizontal', clue: 'Empereur français (1769-1821)', answer: 'NAPOLEON', startRow: 0, startCol: 0, length: 8 },
      { number: 1, direction: 'vertical', clue: 'Aristocratie française', answer: 'NOBLESSE', startRow: 0, startCol: 0, length: 8 },
      { number: 2, direction: 'horizontal', clue: 'Prison parisienne prise en 1789', answer: 'BASTILLE', startRow: 2, startCol: 1, length: 8 },
      { number: 3, direction: 'horizontal', clue: 'Régime de Napoléon', answer: 'EMPIRE', startRow: 4, startCol: 1, length: 6 },
    ]
  }
];

export const getGridsByDifficulty = (difficulty: 'facile' | 'moyen' | 'difficile') => {
  return crosswordGrids.filter(grid => grid.difficulty === difficulty);
};

export const getRandomGrid = (difficulty?: 'facile' | 'moyen' | 'difficile') => {
  const grids = difficulty ? getGridsByDifficulty(difficulty) : crosswordGrids;
  return grids[Math.floor(Math.random() * grids.length)];
};