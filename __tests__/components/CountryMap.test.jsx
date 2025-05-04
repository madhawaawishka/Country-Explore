import { render, screen, waitFor } from "@testing-library/react"
import CountryMap from "@/components/CountryMap"

// Mock fetch for GeoJSON data
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ type: "FeatureCollection", features: [] }),
  }),
)

const mockCountry = {
  cca3: "USA",
  name: { common: "United States" },
  latlng: [38, -97],
  capitalInfo: { latlng: [38.895, -77.0366] },
  capital: ["Washington, D.C."],
}

describe("CountryMap", () => {
  beforeEach(() => {
    fetch.mockClear()
    jest.clearAllMocks()
  })

  test("renders loading state initially", () => {
    render(<CountryMap country={mockCountry} />)

    // Check for loading spinner using data-testid
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument()
  })

  test("fetches country borders on mount", () => {
    render(<CountryMap country={mockCountry} />)

    // Account for the signal object in the fetch call
    expect(fetch).toHaveBeenCalledWith(
      "https://raw.githubusercontent.com/johan/world.geo.json/master/countries/usa.geo.json",
      expect.objectContaining({ signal: expect.any(Object) }),
    )
  })

  test("renders error state when fetch fails", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      }),
    )

    render(<CountryMap country={mockCountry} />)

    await waitFor(() => {
      expect(screen.getByText("Using approximate location - detailed borders unavailable")).toBeInTheDocument()
    })
  })

  test("renders map components when data is loaded", async () => {
    // Mock fetch to return data immediately
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ type: "FeatureCollection", features: [{ type: "Feature" }] }),
      }),
    )

    render(<CountryMap country={mockCountry} />)

    await waitFor(() => {
      expect(screen.getByTestId("map-container")).toBeInTheDocument()
      expect(screen.getByTestId("tile-layer")).toBeInTheDocument()
      expect(screen.getByTestId("geo-json")).toBeInTheDocument()
      expect(screen.getByTestId("map-marker")).toBeInTheDocument()
      expect(screen.getByTestId("map-popup")).toBeInTheDocument()
      expect(screen.getByText("Washington, D.C.")).toBeInTheDocument()
      expect(screen.getByText("Capital of United States")).toBeInTheDocument()
    })
  })
})