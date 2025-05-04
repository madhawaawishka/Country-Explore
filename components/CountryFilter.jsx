"use client"

import { useState, useEffect } from "react"
import { Search, Filter } from "lucide-react"

const CountryFilter = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [region, setRegion] = useState("")
  const [language, setLanguage] = useState("")
  const [availableLanguages, setAvailableLanguages] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"]

  useEffect(() => {
    // Fetch all countries to extract available languages
    const fetchLanguages = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=languages")
        const data = await response.json()

        // Extract all languages
        const languages = new Set()
        data.forEach((country) => {
          if (country.languages) {
            Object.values(country.languages).forEach((lang) => {
              languages.add(lang)
            })
          }
        })

        setAvailableLanguages(Array.from(languages).sort())
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching languages:", error)
        setIsLoading(false)
      }
    }

    fetchLanguages()
  }, [])

  useEffect(() => {
    // Debounce search to avoid too many API calls
    const handler = setTimeout(() => {
      onFilterChange({ searchTerm, region, language })
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm, region, language, onFilterChange])

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-8" id="countries">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a country..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Filter by Region</option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isLoading}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50"
              >
                <option value="">Filter by Language</option>
                {availableLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CountryFilter
