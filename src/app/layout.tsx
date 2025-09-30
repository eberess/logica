import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ColorModeProvider } from '@/context/ColorModeContext';
import { Navbar } from '@/components/Navbar';
import { CssBaseline } from '@mui/material';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Logica - Jeux de Logique",
  description: "Collection de jeux de logique et de réflexion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.className}>
      <head>
      <script defer src="https://umami.wilmoredynamics.com/script.js" data-website-id="c59597d7-c692-4338-bd98-47635aa695c3"></script>
      </head>
      <body>
        <ColorModeProvider>
          <CssBaseline />
          <Navbar />
          {children}
        </ColorModeProvider>
      </body>
    </html>
  );
}
