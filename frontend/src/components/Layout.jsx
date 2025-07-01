import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, FileText, Moon, Sun, Sparkles } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Upload', href: '/upload', current: location.pathname === '/upload' },
    { name: 'Progress', href: '/progress', current: location.pathname === '/progress' },
    { name: 'Download', href: '/download', current: location.pathname === '/download' },
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-secondary-900/80 backdrop-blur-md border-b border-secondary-200 dark:border-secondary-700 sticky top-0 z-50">
        <div className="container">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <FileText className="h-8 w-8 text-primary-600 group-hover:scale-110 transition-transform duration-200" />
                <Sparkles className="h-3 w-3 text-accent-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="text-xl font-bold font-heading text-secondary-900 dark:text-white">
                PDF2PPT.AI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    item.current
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 shadow-sm'
                      : 'text-secondary-600 hover:text-secondary-900 dark:text-secondary-300 dark:hover:text-white hover:bg-secondary-50 dark:hover:bg-secondary-800'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-secondary-600 hover:text-secondary-900 dark:text-secondary-300 dark:hover:text-white transition-all duration-200 hover:bg-secondary-100 dark:hover:bg-secondary-800"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-secondary-600 hover:text-secondary-900 dark:text-secondary-300 dark:hover:text-white transition-all duration-200"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-secondary-600 hover:text-secondary-900 dark:text-secondary-300 dark:hover:text-white transition-all duration-200"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden py-4 border-t border-secondary-200 dark:border-secondary-700"
            >
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                      item.current
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                        : 'text-secondary-600 hover:text-secondary-900 dark:text-secondary-300 dark:hover:text-white hover:bg-secondary-50 dark:hover:bg-secondary-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-700">
        <div className="container py-8">
          <div className="text-center">
            <p className="text-xs text-secondary-400 uppercase tracking-wider font-medium">
              © 2025 PDF2PPT.AI — Built with ❤️ and AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout