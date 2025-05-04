"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import CountryGrid from "./CountryGrid"
import { Heart } from "lucide-react"

const FavoritesPage = () => {
  const { favorites } = useAuth()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <Heart className="h-8 w-8 text-red-500 mr-3 fill-red-500" />
          Your Favorite Countries
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Countries you've marked as favorites will appear here.</p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No favorites yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start exploring countries and add them to your favorites.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Explore Countries
          </Link>
        </div>
      ) : (
        <CountryGrid countries={favorites} loading={false} error={null} />
      )}
    </div>
  )
}

export default FavoritesPage
