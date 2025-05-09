import { render, screen } from "@testing-library/react"
import CountryCard from "@/components/CountryCard"

// Mock the useAuth hook
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    currentUser: { id: "1" },
    toggleFavorite: jest.fn(),
    isFavorite: () => false,
  }),
}))

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>
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
})
