"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

const CountryCard = ({ country }) => {
  const { currentUser, toggleFavorite, isFavorite } = useAuth()
  const favorite = currentUser && isFavorite(country.cca3)

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(country)
  }

  return (
    <Link
      href={`/country/${country.cca3}`}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={country.flags.png || "/placeholder.svg"}
          alt={country.flags.alt || `Flag of ${country.name.common}`}
          className="w-full h-full object-cover"
        />
        {currentUser && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-5 w-5 ${favorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
          </button>
        )}
      </div>
      <div className="p-4 flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{country.name.common}</h3>
        <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <p>
            <span className="font-medium">Capital:</span> {country.capital?.[0] || "N/A"}
          </p>
          <p>
            <span className="font-medium">Region:</span> {country.region}
          </p>
          <p>
            <span className="font-medium">Population:</span> {country.population.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default CountryCard
