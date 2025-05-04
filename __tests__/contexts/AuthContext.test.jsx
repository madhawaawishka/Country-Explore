"use client"

import { render, screen, act, waitFor } from "@testing-library/react"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"

// Create a test component that uses the auth context
const TestComponent = () => {
  const { currentUser, login, register, logout, favorites, toggleFavorite, isFavorite } = useAuth()

  return (
    <div>
      <div data-testid="auth-status">{currentUser ? "Logged In" : "Logged Out"}</div>
      {currentUser && <div data-testid="username">{currentUser.username}</div>}
      <div data-testid="favorites-count">{favorites.length}</div>
      <button onClick={() => login({ id: "1", username: "testuser" })}>Login</button>
      <button onClick={() => register({ email: "test@example.com", password: "password" })}>Register</button>
      <button onClick={logout}>Logout</button>
      <button onClick={() => toggleFavorite({ cca3: "USA", name: { common: "United States" } })}>
        Toggle Favorite
      </button>
      <div data-testid="is-favorite">{isFavorite("USA") ? "Is Favorite" : "Not Favorite"}</div>
    </div>
  )
}

describe("AuthContext", () => {
  beforeEach(() => {
    // Clear localStorage mock
    localStorage.clear()
    jest.clearAllMocks()
  })

  test("provides initial auth state", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    expect(screen.getByTestId("auth-status")).toHaveTextContent("Logged Out")
    expect(screen.getByTestId("favorites-count")).toHaveTextContent("0")
    expect(screen.getByTestId("is-favorite")).toHaveTextContent("Not Favorite")
  })

  test("login updates auth state", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    // Initial state
    expect(screen.getByTestId("auth-status")).toHaveTextContent("Logged Out")

    // Perform login
    act(() => {
      screen.getByRole("button", { name: /login/i }).click()
    })

    // Check updated state
    expect(screen.getByTestId("auth-status")).toHaveTextContent("Logged In")
    expect(screen.getByTestId("username")).toHaveTextContent("testuser")

    // Check localStorage was updated
    expect(localStorage.setItem).toHaveBeenCalledWith("user", JSON.stringify({ id: "1", username: "testuser" }))
  })

  test("register creates new user and updates auth state", async () => {
    // Mock Date.now for consistent ID generation
    const mockDate = 1234567890
    jest.spyOn(Date, "now").mockImplementation(() => mockDate)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    // Initial state
    expect(screen.getByTestId("auth-status")).toHaveTextContent("Logged Out")

    // Perform registration
    act(() => {
      screen.getByRole("button", { name: /register/i }).click()
    })

    // Check updated state
    expect(screen.getByTestId("auth-status")).toHaveTextContent("Logged In")

    // Check localStorage was updated with new user
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "user",
      JSON.stringify({
        email: "test@example.com",
        password: "password",
        id: mockDate.toString(),
      }),
    )

    // Check favorites were initialized
    expect(localStorage.setItem).toHaveBeenCalledWith(`favorites_${mockDate}`, JSON.stringify([]))
  })

  test("logout clears auth state", async () => {
    // Setup initial logged in state
    localStorage.getItem.mockImplementation((key) => {
      if (key === "user") return JSON.stringify({ id: "1", username: "testuser" })
      return null
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    // Wait for auth to initialize
    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("Logged In")
    })

    // Perform logout
    act(() => {
      screen.getByRole("button", { name: /logout/i }).click()
    })

    // Check updated state
    expect(screen.getByTestId("auth-status")).toHaveTextContent("Logged Out")

    // Check localStorage was updated
    expect(localStorage.removeItem).toHaveBeenCalledWith("user")
  })

  test("toggleFavorite adds and removes favorites", async () => {
    // Setup initial logged in state with no favorites
    localStorage.getItem.mockImplementation((key) => {
      if (key === "user") return JSON.stringify({ id: "1", username: "testuser" })
      if (key === "favorites_1") return JSON.stringify([])
      return null
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    // Wait for auth to initialize
    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("Logged In")
    })

    // Initial state - no favorites
    expect(screen.getByTestId("favorites-count")).toHaveTextContent("0")
    expect(screen.getByTestId("is-favorite")).toHaveTextContent("Not Favorite")

    // Add a favorite
    act(() => {
      screen.getByRole("button", { name: /toggle favorite/i }).click()
    })

    // Check favorite was added
    expect(screen.getByTestId("favorites-count")).toHaveTextContent("1")
    expect(screen.getByTestId("is-favorite")).toHaveTextContent("Is Favorite")

    // Toggle again to remove
    act(() => {
      screen.getByRole("button", { name: /toggle favorite/i }).click()
    })

    // Check favorite was removed
    expect(screen.getByTestId("favorites-count")).toHaveTextContent("0")
    expect(screen.getByTestId("is-favorite")).toHaveTextContent("Not Favorite")
  })

  test("loads user and favorites from localStorage on mount", async () => {
    // Setup localStorage mock with existing user and favorites
    const mockUser = { id: "1", username: "testuser" }
    const mockFavorites = [{ cca3: "USA", name: { common: "United States" } }]

    localStorage.getItem.mockImplementation((key) => {
      if (key === "user") return JSON.stringify(mockUser)
      if (key === "favorites_1") return JSON.stringify(mockFavorites)
      return null
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    // Check state was loaded from localStorage
    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("Logged In")
      expect(screen.getByTestId("username")).toHaveTextContent("testuser")
      expect(screen.getByTestId("favorites-count")).toHaveTextContent("1")
      expect(screen.getByTestId("is-favorite")).toHaveTextContent("Is Favorite")
    })
  })
})
