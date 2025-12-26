import { Inter } from 'next/font/google';
import { Play } from 'next/font/google';
import './globals.css';
import AuthProvider from "@/components/AuthProvider";
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';


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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
         <div className="container">
          <AuthProvider>
            <Navbar />
            {children}
            <Footer />
          </AuthProvider>
          </div>
       
      </body>
    </html>
  );
}