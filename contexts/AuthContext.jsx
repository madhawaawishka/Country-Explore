"use client"

import { createContext, useState, useContext, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    // Check if user is logged in from localStorage
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user"))
      if (user) {
        setCurrentUser(user)
        // Load favorites from localStorage
        const savedFavorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`)) || []
        setFavorites(savedFavorites)
      }
      setLoading(false)
    }
  }, [])

  const login = (userData) => {
    // In a real app, this would validate with a backend
    setCurrentUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))

    // Load favorites for this user
    const savedFavorites = JSON.parse(localStorage.getItem(`favorites_${userData.id}`)) || []
    setFavorites(savedFavorites)

    return true
  }

  const register = (userData) => {
    // In a real app, this would register with a backend
    const newUser = { ...userData, id: Date.now().toString() }
    setCurrentUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    localStorage.setItem(`favorites_${newUser.id}`, JSON.stringify([]))
    setFavorites([])
    return true
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("user")
  }

  const toggleFavorite = (country) => {
    if (!currentUser) return

    let newFavorites
    if (favorites.some((fav) => fav.cca3 === country.cca3)) {
      newFavorites = favorites.filter((fav) => fav.cca3 !== country.cca3)
    } else {
      newFavorites = [...favorites, country]
    }

    setFavorites(newFavorites)
    localStorage.setItem(`favorites_${currentUser.id}`, JSON.stringify(newFavorites))
  }

  const isFavorite = (countryCode) => {
    return favorites.some((country) => country.cca3 === countryCode)
  }

  const value = {
    currentUser,
    login,
    register,
    logout,
    favorites,
    toggleFavorite,
    isFavorite,
    loading,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
