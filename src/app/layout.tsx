import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ColorModeProvider } from '@/context/ColorModeContext';
import { Navbar } from '@/components/Navbar';
import { CssBaseline } from '@mui/material';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="fr">
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
