import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans'; // Corrected import
import { GeistMono } from 'geist/font/mono'; // Corrected import
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Added Toaster import

const geistSans = GeistSans; // Direct usage if it's not an object with variable
const geistMono = GeistMono; // Direct usage

export const metadata: Metadata = {
  title: 'Trastero Manager',
  description: 'Manage your storage boxes and items with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
