"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Users, Globe, MapPin, Languages, DollarSign, Heart } from "lucide-react"
import CountryMap from "./CountryMap"
import { useAuth } from "@/contexts/AuthContext"

const CountryDetailPage = ({ countryId }) => {
  const [country, setCountry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { currentUser, toggleFavorite, isFavorite } = useAuth()

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryId}`)
        if (!response.ok) {
          throw new Error("Country not found")
        }
        const data = await response.json()
        setCountry(data[0])
        setLoading(false)
      } catch (err) {
        console.error("Error fetching country:", err)
        setError("Failed to load country details. Please try again later.")
        setLoading(false)
      }
    }

    fetchCountry()
  }, [countryId])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !country) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-lg">{error || "Country not found"}</p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const favorite = currentUser && isFavorite(country.cca3)

  const handleFavoriteClick = () => {
    toggleFavorite(country)
  }

  // Format languages as a comma-separated string
  const languages = country.languages ? Object.values(country.languages).join(", ") : "None"

  // Format currencies
  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map((currency) => `${currency.name} (${currency.symbol})`)
        .join(", ")
    : "None"

  // Format borders
  const borders = country.borders ? country.borders.join(", ") : "None"

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {currentUser && (
          <button
            onClick={handleFavoriteClick}
            className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm ${
              favorite
                ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <Heart className={`h-4 w-4 mr-2 ${favorite ? "fill-red-500" : ""}`} />
            {favorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="aspect-video overflow-hidden rounded-lg shadow-lg mb-6">
            <img
              src={country.flags.svg || country.flags.png}
              alt={country.flags.alt || `Flag of ${country.name.common}`}
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{country.name.common}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{country.name.official}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Capital:</span>{" "}
                    <span className="text-gray-600 dark:text-gray-400">{country.capital?.[0] || "N/A"}</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Globe className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Region:</span>{" "}
                    <span className="text-gray-600 dark:text-gray-400">
                      {country.region} ({country.subregion})
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Population:</span>{" "}
                    <span className="text-gray-600 dark:text-gray-400">{country.population.toLocaleString()}</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Languages className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Languages:</span>{" "}
                    <span className="text-gray-600 dark:text-gray-400">{languages}</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <DollarSign className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Currencies:</span>{" "}
                    <span className="text-gray-600 dark:text-gray-400">{currencies}</span>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Additional Details</h2>
              <ul className="space-y-3">
                <li>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Area:</span>{" "}
                  <span className="text-gray-600 dark:text-gray-400">{country.area.toLocaleString()} km²</span>
                </li>
                <li>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Borders:</span>{" "}
                  <span className="text-gray-600 dark:text-gray-400">{borders}</span>
                </li>
                <li>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Top Level Domain:</span>{" "}
                  <span className="text-gray-600 dark:text-gray-400">{country.tld?.join(", ") || "N/A"}</span>
                </li>
                <li>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Timezones:</span>{" "}
                  <span className="text-gray-600 dark:text-gray-400">{country.timezones?.join(", ") || "N/A"}</span>
                </li>
                <li>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Driving Side:</span>{" "}
                  <span className="text-gray-600 dark:text-gray-400">{country.car?.side || "N/A"}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Location</h2>
          <CountryMap country={country} />

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Coat of Arms</h2>
            {country.coatOfArms?.png ? (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex justify-center">
                <img
                  src={country.coatOfArms.png || "/placeholder.svg"}
                  alt={`Coat of Arms of ${country.name.common}`}
                  className="max-h-48"
                />
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No coat of arms available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CountryDetailPage
