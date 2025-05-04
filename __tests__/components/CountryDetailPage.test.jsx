import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import CountryDetailPage from "@/components/CountryDetailPage"

// Mock the CountryMap component
jest.mock("@/components/CountryMap", () => ({ country }) => (
  <div data-testid="country-map">Map for {country.name.common}</div>
))

// Mock the useAuth hook
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    currentUser: { id: "1" },
    toggleFavorite: jest.fn(),
    isFavorite: () => false,
  }),
}))

// Mock fetch for country data
const mockCountry = {
  cca3: "USA",
  name: { common: "United States", official: "United States of America" },
  capital: ["Washington, D.C."],
  capitalInfo: { latlng: [38.895, -77.0366] },
  latlng: [38, -97],
  region: "Americas",
  subregion: "North America",
  population: 329484123,
  languages: { eng: "English" },
  currencies: { USD: { name: "United States dollar", symbol: "$" } },
  borders: ["CAN", "MEX"],
  flags: { svg: "usa-flag.svg", png: "usa-flag.png", alt: "Flag of USA" },
  coatOfArms: { png: "usa-coat.png" },
  area: 9833520,
  tld: [".us"],
  timezones: ["UTC-12:00", "UTC-11:00", "UTC-10:00"],
  car: { side: "right" },
}

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([mockCountry]),
  }),
)

describe("CountryDetailPage", () => {
  beforeEach(() => {
    fetch.mockClear()
    jest.clearAllMocks()
  })

  test("renders loading state initially", () => {
    render(<CountryDetailPage countryId="USA" />)

    // Check for loading spinner using data-testid
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument()
  })

  test("fetches country data on mount", () => {
    render(<CountryDetailPage countryId="USA" />)

    expect(fetch).toHaveBeenCalledWith("https://restcountries.com/v3.1/alpha/USA")
  })

  test("renders country details when data is loaded", async () => {
    render(<CountryDetailPage countryId="USA" />)

    await waitFor(() => {
      expect(screen.getByText("United States")).toBeInTheDocument()
      expect(screen.getByText("United States of America")).toBeInTheDocument()
      expect(screen.getByText("Washington, D.C.")).toBeInTheDocument()
      expect(screen.getByText(/329,484,123/)).toBeInTheDocument()
      expect(screen.getByText("English")).toBeInTheDocument()
      expect(screen.getByText("United States dollar ($)")).toBeInTheDocument()
      expect(screen.getByText("CAN, MEX")).toBeInTheDocument()
      expect(screen.getByText("9,833,520 km²")).toBeInTheDocument()
      expect(screen.getByText(".us")).toBeInTheDocument()
      expect(screen.getByText("UTC-12:00, UTC-11:00, UTC-10:00")).toBeInTheDocument()
      expect(screen.getByText("right")).toBeInTheDocument()
      expect(screen.getByTestId("country-map")).toBeInTheDocument()
    })
  })

  test("handles fetch error", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      }),
    )

    render(<CountryDetailPage countryId="INVALID" />)

    await waitFor(() => {
      expect(screen.getByText("Failed to load country details. Please try again later.")).toBeInTheDocument()
    })
  })

  test("toggles favorite status when favorite button is clicked", async () => {
    const toggleFavoriteMock = jest.fn()
    jest.spyOn(require("@/contexts/AuthContext"), "useAuth").mockImplementation(() => ({
      currentUser: { id: "1" },
      toggleFavorite: toggleFavoriteMock,
      isFavorite: () => false,
    }))

    render(<CountryDetailPage countryId="USA" />)

    await waitFor(() => {
      expect(screen.getByText("United States")).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole("button", { name: /add to favorites/i }))

    expect(toggleFavoriteMock).toHaveBeenCalledWith(mockCountry)
  })

  test("does not show favorite button when user is not logged in", async () => {
    jest.spyOn(require("@/contexts/AuthContext"), "useAuth").mockImplementation(() => ({
      currentUser: null,
      toggleFavorite: jest.fn(),
      isFavorite: () => false,
    }))

    render(<CountryDetailPage countryId="USA" />)

    await waitFor(() => {
      expect(screen.getByText("United States")).toBeInTheDocument()
    })

    expect(screen.queryByRole("button", { name: /add to favorites/i })).not.toBeInTheDocument()
  })
})