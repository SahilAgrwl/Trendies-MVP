import './globals.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import { Inter } from 'next/font/google';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ColorSchemeScript } from '@mantine/core';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Trendies - Luxury Resale Marketplace',
  description: 'Restore trust and quality in secondhand fashion with Trendies.',
};

// Create theme to be used consistently on both server and client
const theme = createTheme({
  primaryColor: 'pink',
  fontFamily: 'Inter, sans-serif',
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        radius: 'xl',
      },
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <MantineProvider theme={theme}>
          <Notifications />
          <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-md sticky top-0 z-10 transition-shadow duration-300">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center">
                    <Link href="/" className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 transition-all duration-300 flex items-center">
                      <div className="relative w-10 h-10 mr-2 transform transition-transform duration-500 hover:rotate-12">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ec4899" />
                              <stop offset="100%" stopColor="#f43f5e" />
                            </linearGradient>
                          </defs>
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </div>
                      Trendies
                    </Link>
                  </div>
                  <nav className="hidden md:flex space-x-1">
                    <Link 
                      href="/" 
                      className="relative text-gray-600 hover:text-pink-600 px-3 py-2 rounded-lg text-sm font-medium group transition-colors overflow-hidden"
                    >
                      <span className="relative z-10">Catalog</span>
                      <span className="absolute inset-0 bg-pink-50 scale-0 group-hover:scale-100 transition-transform duration-300 origin-bottom-left rounded-lg"></span>
                    </Link>
                    <Link 
                      href="/sell" 
                      className="relative text-gray-600 hover:text-pink-600 px-3 py-2 rounded-lg text-sm font-medium group transition-colors overflow-hidden"
                    >
                      <span className="relative z-10">Sell</span>
                      <span className="absolute inset-0 bg-pink-50 scale-0 group-hover:scale-100 transition-transform duration-300 origin-bottom-left rounded-lg"></span>
                    </Link>
                    <Link 
                      href="/admin" 
                      className="relative text-gray-600 hover:text-pink-600 px-3 py-2 rounded-lg text-sm font-medium group transition-colors overflow-hidden"
                    >
                      <span className="relative z-10">Admin</span>
                      <span className="absolute inset-0 bg-pink-50 scale-0 group-hover:scale-100 transition-transform duration-300 origin-bottom-left rounded-lg"></span>
                    </Link>
                  </nav>
                  
                  {/* Mobile menu button */}
                  <div className="md:hidden flex items-center">
                    <details className="dropdown dropdown-end relative">
                      <summary className="m-1 btn btn-ghost p-1 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 hover:text-pink-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </summary>
                      <ul className="p-2 shadow-lg menu dropdown-content z-[1] bg-white rounded-xl w-52 border border-gray-100 mt-2 overflow-hidden">
                        <li>
                          <Link href="/" className="px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                            <span>Catalog</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/sell" className="px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                            <span>Sell</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/admin" className="px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                            <span>Admin</span>
                          </Link>
                        </li>
                      </ul>
                    </details>
                  </div>
                </div>
              </div>
            </header>
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            
            <footer className="bg-white border-t border-gray-200 mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="relative w-8 h-8 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="url(#gradient-footer)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <defs>
                            <linearGradient id="gradient-footer" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ec4899" />
                              <stop offset="100%" stopColor="#f43f5e" />
                            </linearGradient>
                          </defs>
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Trendies</h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Luxury resale marketplace built to restore trust and quality in secondhand fashion. Every item is authenticated by our experts.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
                    <ul className="space-y-3">
                      <li>
                        <Link href="/" className="text-gray-600 hover:text-pink-600 text-sm flex items-center group">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400 group-hover:text-pink-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <span>Home</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/sell" className="text-gray-600 hover:text-pink-600 text-sm flex items-center group">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400 group-hover:text-pink-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <span>Sell with us</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/admin" className="text-gray-600 hover:text-pink-600 text-sm flex items-center group">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400 group-hover:text-pink-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <span>Admin</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Contact</h3>
                    <div className="flex items-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-600 text-sm">info@trendies.com</p>
                    </div>
                    <div className="flex space-x-4 mt-6">
                      <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-pink-100 hover:text-pink-600 transition-colors">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                        </svg>
                      </a>
                      <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-pink-100 hover:text-pink-600 transition-colors">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                        </svg>
                      </a>
                      <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-pink-100 hover:text-pink-600 transition-colors">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-10 border-t border-gray-200 pt-8">
                  <p className="text-center text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} Trendies. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}
