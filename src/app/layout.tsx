import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import { ChakraProvider } from '@chakra-ui/react'
import "./globals.css";

const inter = Press_Start_2P({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wordle for Dummies",
  description: "a simplified version of the Wordle game.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className={inter.className}>
          <ChakraProvider>{children}</ChakraProvider>
        </body>
    </html>
  );
}
