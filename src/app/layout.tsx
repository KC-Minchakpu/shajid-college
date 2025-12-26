import { Inter, Play } from 'next/font/google';
import './globals.css';
import AuthProvider from "@/components/AuthProvider";
import { MultiStepProvider } from "@/context/MultiStepContext";
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

const play = Play({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-play',
});

export const metadata = {
  title: 'Shajid College App',
  description:
    'This is a full-featured, responsive web application built using Next.js for Shajid College of Nursing and Midwifery.',
};

// Added Type for props: { children: ReactNode }
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      {/* Added the 'play' variable to the body class */}
      <body className={`${inter.className} ${play.variable}`}>
        <div className="container">
          <AuthProvider>
            {/* Wrap children with MultiStepProvider so forms can share state */}
            <MultiStepProvider>
              <Navbar />
              <main>
                {children}
              </main>
              <Footer />
            </MultiStepProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}