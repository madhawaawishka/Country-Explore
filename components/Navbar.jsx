"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { useAuth } from "@/contexts/AuthContext"
import { Sun, Moon, Globe, Menu, X, User, LogOut, Heart } from "lucide-react"

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme()
  const { currentUser, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const handleLogout = () => {
    logout()
    router.push("/")
    setIsMenuOpen(false)
  }

  const isActive = (path) => pathname === path ? 
    "text-blue-600 dark:text-blue-400 font-medium" : 
    "text-gray-700 dark:text-gray-200"

  return (
    <nav className={`sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm transition-all duration-300 ${
      scrolled ? "shadow-md" : ""
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center justify-center group transition-all duration-300">
              <Globe className="h-7 w-7 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Country Explorer</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive("/")}`}
            >
              Home
            </Link>

            {currentUser ? (
              <>
                <Link
                  href="/favorites"
                  className={`px-3 py-2 rounded-md text-sm transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center ${isActive("/favorites")}`}
                >
                  <Heart className="h-4 w-4 mr-1" />
                  Favorites
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center transition-all duration-200"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
                <div className="flex items-center px-3 py-1.5 text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full">
                  <User className="h-4 w-4 mr-1.5 text-blue-600 dark:text-blue-400" />
                  {currentUser.username}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow"
                >
                  Registers
                </Link>
              </>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {darkMode ? 
                <Sun className="h-5 w-5 text-yellow-500 hover:scale-110 transition-transform" /> : 
                <Moon className="h-5 w-5 hover:scale-110 transition-transform" />
              }
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 mr-2 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {darkMode ? 
                <Sun className="h-5 w-5 text-yellow-500" /> : 
                <Moon className="h-5 w-5" />
              }
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              aria-label="Open menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-white dark:bg-gray-900 shadow-lg rounded-b-lg border-t dark:border-gray-800 animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className={`block px-3 py-2.5 rounded-md text-base transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive("/")}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {currentUser ? (
              <>
                <Link
                  href="/favorites"
                  className={`block px-3 py-2.5 rounded-md text-base transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center ${isActive("/favorites")}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Favorites
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
                <div className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 flex items-center bg-gray-50 dark:bg-gray-800">
                  <User className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  {currentUser.username}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <div className="px-3 py-2">
                  <Link
                    href="/register"
                    className="block w-full text-center px-3 py-2.5 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar