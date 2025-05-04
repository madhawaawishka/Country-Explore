import { render, screen } from "@testing-library/react"
import CountryGrid from "@/components/CountryGrid"

// Mock the CountryCard component
jest.mock("@/components/CountryCard", () => {
  return function MockCountryCard({ country }) {
    return <div data-testid={`country-card-${country.cca3}`}>{country.name.common}</div>
  }
})

const mockCountries = [
  {
    cca3: "USA",
    name: { common: "United States", official: "United States of America" },
    capital: ["Washington, D.C."],
    region: "Americas",
    population: 329484123,
    flags: { png: "usa-flag.png", alt: "Flag of USA" },
  },
  {
    cca3: "CAN",
    name: { common: "Canada", official: "Canada" },
    capital: ["Ottawa"],
    region: "Americas",
    population: 38005238,
    flags: { png: "canada-flag.png", alt: "Flag of Canada" },
  },
]

describe("CountryGrid", () => {
  test("renders loading state", () => {
    render(<CountryGrid countries={[]} loading={true} error={null} />)

    expect(screen.getByRole("status")).toBeInTheDocument()
  })

  test("renders error state", () => {
    const errorMessage = "Failed to load countries"
    render(<CountryGrid countries={[]} loading={false} error={errorMessage} />)

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
    expect(screen.getByText("Please try again later.")).toBeInTheDocument()
  })

  test("renders empty state when no countries match filters", () => {
    render(<CountryGrid countries={[]} loading={false} error={null} />)

    expect(screen.getByText("No countries found matching your criteria.")).toBeInTheDocument()
    expect(screen.getByText("Try adjusting your search or filters.")).toBeInTheDocument()
  })

  test("renders country cards for each country", () => {
    render(<CountryGrid countries={mockCountries} loading={false} error={null} />)

    expect(screen.getByTestId("country-card-USA")).toBeInTheDocument()
    expect(screen.getByTestId("country-card-CAN")).toBeInTheDocument()
    expect(screen.getByText("United States")).toBeInTheDocument()
    expect(screen.getByText("Canada")).toBeInTheDocument()
  })
})
