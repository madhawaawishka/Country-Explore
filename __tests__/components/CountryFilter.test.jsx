import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import CountryFilter from "@/components/CountryFilter"

// Mock fetch for language data
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        { languages: { eng: "English", fra: "French" } },
        { languages: { spa: "Spanish", por: "Portuguese" } },
      ]),
  }),
)

describe("CountryFilter", () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  test("renders search input and filter dropdowns", async () => {
    render(<CountryFilter onFilterChange={() => {}} />)

    expect(screen.getByPlaceholderText("Search for a country...")).toBeInTheDocument()
    expect(screen.getByText("Filter by Region")).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText("Filter by Language")).toBeInTheDocument()
    })
  })

  test("calls onFilterChange when search input changes", async () => {
    const mockOnFilterChange = jest.fn()
    render(<CountryFilter onFilterChange={mockOnFilterChange} />)

    const searchInput = screen.getByPlaceholderText("Search for a country...")
    fireEvent.change(searchInput, { target: { value: "Canada" } })

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          searchTerm: "Canada",
        }),
      )
    })
  })

  test("calls onFilterChange when region filter changes", async () => {
    const mockOnFilterChange = jest.fn()
    render(<CountryFilter onFilterChange={mockOnFilterChange} />)

    const regionSelect = screen.getByText("Filter by Region").closest("select")
    fireEvent.change(regionSelect, { target: { value: "Americas" } })

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          region: "Americas",
        }),
      )
    })
  })

  test("calls onFilterChange when language filter changes", async () => {
    const mockOnFilterChange = jest.fn()
    render(<CountryFilter onFilterChange={mockOnFilterChange} />)

    // Wait for languages to load
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("https://restcountries.com/v3.1/all?fields=languages")
      expect(screen.getByText("Filter by Language")).toBeInTheDocument()
    })

    // Target the language select using data-testid or text
    const languageSelect = screen.getByTestId("language-filter-select") || screen.getByText("Filter by Language").closest("select")
    fireEvent.change(languageSelect, { target: { value: "English" } })

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          language: "English",
        }),
      )
    })
  })
})