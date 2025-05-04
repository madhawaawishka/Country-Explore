import { Heart, Github } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 shadow-inner py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              © {new Date().getFullYear()} Country Explorer. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <span className="mr-2 text-sm">Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
            </div>
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          Data provided by{" "}
          <a
            href="https://restcountries.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-600 dark:hover:text-blue-400"
          >
            REST Countries API
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
