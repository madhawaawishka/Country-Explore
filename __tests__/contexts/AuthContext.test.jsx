"use client"

import { render, screen } from "@testing-library/react"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"

// Create a simple test component
const TestComponent = () => {
  const { currentUser } = useAuth()
  return (
    <div>
      <div data-testid="auth-status">{currentUser ? "Logged In" : "Logged Out"}</div>
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
  })
})
