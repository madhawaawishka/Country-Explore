import { render, screen, waitFor, act } from "@testing-library/react"
import HomePage from "@/components/HomePage"

// Mock the child components
jest.mock("@/components/Hero", () => () => <div data-testid="hero">Hero Component</div>)
jest.mock("@/components/CountryFilter", () => ({ onFilterChange }) => (
  <div data-testid="country-filter">
    <button onClick={() => onFilterChange({ searchTerm: "United" })}>Test Filter</button>
  </div>
))
jest.mock("@/components/CountryGrid", () => ({ countries, loading, error }) => (
  <div data-testid="country-grid">
    {loading ? "Loading..." : error ? error : `Showing ${countries.length} countries`}
  </div>
))

// Mock fetch for countries data
const mockCountries = [
  { cca3: "USA", name: { common: "United States" } },
  { cca3: "CAN", name: { common: "Canada" } },
]

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockCountries),
  }),
)

describe("HomePage", () => {
  beforeEach(() => {
    fetch.mockClear()
    jest.clearAllMocks()
  })

  test("renders all components and fetches countries", async () => {
    render(<HomePage />)

    // Check that all components are rendered
    expect(screen.getByTestId("hero")).toBeInTheDocument()
    expect(screen.getByTestId("country-filter")).toBeInTheDocument()
    expect(screen.getByText("Loading...")).toBeInTheDocument()

    // Check that fetch was called
    expect(fetch).toHaveBeenCalledWith("https://restcountries.com/v3.1/all")

    // Wait for countries to load
    await waitFor(() => {
      expect(screen.getByText("Showing 2 countries")).toBeInTheDocument()
    })
  })

  test("handles fetch error", async () => {
    fetch.mockImplementationOnce(() => 
      Promise.reject(new Error("Failed to fetch countries"))
    )

    render(<HomePage />)

    await waitFor(() => {
      expect(screen.getByText("Failed to load countries. Please try again later.")).toBeInTheDocument()
    })
  })

  test("filters countries based on search term", async () => {
    render(<HomePage />)

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText("Showing 2 countries")).toBeInTheDocument()
    })

    // Simulate filter change by clicking the test button in our mock
    act(() => {
      screen.getByText("Test Filter").click()
    })

    // Check that countries are filtered
    await waitFor(() => {
      expect(screen.getByText("Showing 1 countries")).toBeInTheDocument()
    })
  })
})