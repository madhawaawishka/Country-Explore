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

  test("renders search input and region filter", async () => {
    render(<CountryFilter onFilterChange={() => {}} />)

    expect(screen.getByPlaceholderText("Search for a country...")).toBeInTheDocument()
    expect(screen.getByText("Filter by Region")).toBeInTheDocument()
  })

  test("calls onFilterChange when search input changes", async () => {
    const mockOnFilterChange = jest.fn()
    render(<CountryFilter onFilterChange={mockOnFilterChange} />)

    const searchInput = screen.getByPlaceholderText("Search for a country...")
    fireEvent.change(searchInput, { target: { value: "Canada" } })

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalled()
    })
  })
})
