import { render, screen, fireEvent } from "@testing-library/react"
import CountryCard from "@/components/CountryCard"

// Mock the useAuth hook
jest.mock("@/contexts/AuthContext", () => {
  const originalModule = jest.requireActual("@/contexts/AuthContext")
  return {
    ...originalModule,
    useAuth: () => ({
      currentUser: { id: "1" },
      toggleFavorite: jest.fn(),
      isFavorite: jest.fn(() => false),
    }),
  }
})

const mockCountry = {
  cca3: "CAN",
  name: {
    common: "Canada",
    official: "Canada",
  },
  capital: ["Ottawa"],
  region: "Americas",
  population: 38005238,
  flags: {
    png: "https://flagcdn.com/w320/ca.png",
    alt: "The flag of Canada",
  },
}

describe("CountryCard", () => {
  test("renders country information correctly", () => {
    render(<CountryCard country={mockCountry} />)

    expect(screen.getByText("Canada")).toBeInTheDocument()
    expect(screen.getByText(/Ottawa/i)).toBeInTheDocument()
    expect(screen.getByText(/Americas/i)).toBeInTheDocument()
    expect(screen.getByText(/38,005,238/i)).toBeInTheDocument()
    expect(screen.getByAltText("The flag of Canada")).toBeInTheDocument()
  })

  test("links to country detail page", () => {
    render(<CountryCard country={mockCountry} />)

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/country/CAN")
  })

  test("favorite button toggles favorite status", () => {
    const toggleFavoriteMock = jest.fn()
    jest.spyOn(require("@/contexts/AuthContext"), "useAuth").mockImplementation(() => ({
      currentUser: { id: "1" },
      toggleFavorite: toggleFavoriteMock,
      isFavorite: () => false,
    }))

    render(<CountryCard country={mockCountry} />)

    const favoriteButton = screen.getByRole("button", { name: /add to favorites/i })
    fireEvent.click(favoriteButton)

    expect(toggleFavoriteMock).toHaveBeenCalledWith(mockCountry)
  })

  test("does not show favorite button when user is not logged in", () => {
    jest.spyOn(require("@/contexts/AuthContext"), "useAuth").mockImplementation(() => ({
      currentUser: null,
      toggleFavorite: jest.fn(),
      isFavorite: () => false,
    }))

    render(<CountryCard country={mockCountry} />)

    expect(screen.queryByRole("button", { name: /add to favorites/i })).not.toBeInTheDocument()
  })
})
