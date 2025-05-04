"use client"

import { useState, useEffect } from "react"
import Hero from "./Hero"
import CountryFilter from "./CountryFilter"
import CountryGrid from "./CountryGrid"

const HomePage = () => {
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    searchTerm: "",
    region: "",
    language: "",
  })

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all")
        if (!response.ok) {
          throw new Error("Failed to fetch countries")
        }
        const data = await response.json()
        setCountries(data)
        setFilteredCountries(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching countries:", err)
        setError("Failed to load countries. Please try again later.")
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  useEffect(() => {
    if (countries.length === 0) return

    let result = [...countries]

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      result = result.filter(
        (country) =>
          country.name.common.toLowerCase().includes(searchLower) ||
          (country.name.official && country.name.official.toLowerCase().includes(searchLower)) ||
          (country.capital && country.capital.some((cap) => cap.toLowerCase().includes(searchLower))),
      )
    }

    // Filter by region
    if (filters.region) {
      result = result.filter((country) => country.region === filters.region)
    }

    // Filter by language
    if (filters.language) {
      result = result.filter((country) => {
        if (!country.languages) return false
        return Object.values(country.languages).some((lang) => lang.toLowerCase() === filters.language.toLowerCase())
      })
    }

    setFilteredCountries(result)
  }, [countries, filters])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  return (
    <div>
      <Hero />
      <CountryFilter onFilterChange={handleFilterChange} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CountryGrid countries={filteredCountries} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default HomePage
