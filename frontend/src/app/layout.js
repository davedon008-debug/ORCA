import './globals.css';
import { Providers } from './Providers';
import Navbar from '../components/Navbar';
import CategoryNavbar from '../components/CategoryNavbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import { Inter, Outfit } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata = {
  title: 'BIGDON | Modern E-commerce',
  description: 'Premium home appliance and furniture mall.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="bg-slate-50 text-slate-900 font-sans antialiased flex flex-col min-h-screen">
        <Providers>
          <Navbar />
          <CategoryNavbar />
          <main className="flex-grow selection:bg-blue-500 selection:text-white">{children}</main>
          <Footer />
          <AuthModal />
        </Providers>
      </body>
    </html>
  );
}
