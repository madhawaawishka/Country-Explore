"use client"

import { render, screen, act, waitFor } from "@testing-library/react"
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext"

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = String(value)
    }),
    removeItem: jest.fn((key) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
})

// Create a test component that uses the theme context
const TestComponent = () => {
  const { darkMode, toggleTheme } = useTheme()

  return (
    <div>
      <div data-testid="theme-status">{darkMode ? "Dark Mode" : "Light Mode"}</div>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  )
}

describe("ThemeContext", () => {
  beforeEach(() => {
    // Clear localStorage mock
    localStorageMock.clear()
    jest.clearAllMocks()

    // Reset document.documentElement.classList
    document.documentElement.classList.remove("dark")
  })

  test("provides default theme state (light mode)", async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId("theme-status")).toHaveTextContent("Light Mode")
      expect(document.documentElement.classList.contains("dark")).toBe(false)
    })
  })

  test("loads theme preference from localStorage", async () => {
    // Setup localStorage mock with dark mode preference
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === "theme") return "dark"
      return null
    })

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    )

    // Check state was loaded from localStorage
    await waitFor(() => {
      expect(screen.getByTestId("theme-status")).toHaveTextContent("Dark Mode")
      expect(document.documentElement.classList.contains("dark")).toBe(true)
      expect(localStorageMock.getItem).toHaveBeenCalledWith("theme")
    })
  })

  test("toggles theme between light and dark mode", async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    )

    // Wait for component to mount and initialize
    await waitFor(() => {
      expect(screen.getByTestId("theme-status")).toHaveTextContent("Light Mode")
    })

    // Toggle to dark mode
    act(() => {
      screen.getByRole("button", { name: /toggle theme/i }).click()
    })

    // Check theme was updated
    expect(screen.getByTestId("theme-status")).toHaveTextContent("Dark Mode")
    expect(document.documentElement.classList.contains("dark")).toBe(true)
    expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "dark")

    // Toggle back to light mode
    act(() => {
      screen.getByRole("button", { name: /toggle theme/i }).click()
    })

    // Check theme was updated
    expect(screen.getByTestId("theme-status")).toHaveTextContent("Light Mode")
    expect(document.documentElement.classList.contains("dark")).toBe(false)
    expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "light")
  })
})