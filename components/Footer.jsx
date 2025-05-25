import { Heart, Github, Globe, Mail, ExternalLink } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand column */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Country Explorer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Discover and learn about countries around the world through an interactive experience.
            </p>
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mt-auto">
              <span className="mr-2">Design and Developed by madhawaawishka</span>
            </div>
          </div>

          {/* Links column */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  About
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Connect column */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Connect</h3>
            <div className="flex flex-col space-y-2">
              <a 
                href="https://github.com/madhawaawishka/Country-Explore" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Github className="h-4 w-4 mr-2" />
                <span>View on GitHub</span>
              </a>
              <a 
                href="mailto:madhawaawishka@gmail.com"
                className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Mail className="h-4 w-4 mr-2" />
                <span>Contact us</span>
              </a>
              <a 
                href="https://restcountries.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Globe className="h-4 w-4 mr-2" />
                <span>REST Countries API</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Country Explorer. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <a 
              href="#top" 
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Back to top
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer