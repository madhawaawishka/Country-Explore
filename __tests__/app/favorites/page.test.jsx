import { render, screen, waitFor } from "@testing-library/react"
import Page from "@/app/favorites/page"
import { useRouter } from "next/navigation"
import jest from "jest-mock"

// Mock the FavoritesPage component
jest.mock("@/components/FavoritesPage", () => () => <div data-testid="favorites-page">Favorites Page Component</div>)

// Mock the useAuth hook
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    currentUser: { id: "1" },
  }),
}))

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: jest.fn(),
}))

describe("Favorites Page", () => {
  test("renders FavoritesPage component when user is logged in", () => {
    render(<Page />)

    expect(screen.getByTestId("favorites-page")).toBeInTheDocument()
  })

  test("redirects to login page when user is not logged in", async () => {
    // Mock user not logged in
    jest.spyOn(require("@/contexts/AuthContext"), "useAuth").mockImplementation(() => ({
      currentUser: null,
    }))

    // Mock router
    const mockPush = jest.fn()
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }))

    render(<Page />)

    // Check that router.push was called with login page
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login")
    })

    // Check that FavoritesPage is not rendered
    expect(screen.queryByTestId("favorites-page")).not.toBeInTheDocument()
  })
})
