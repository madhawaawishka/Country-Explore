import { render, screen } from "@testing-library/react"
import Page from "@/app/country/[countryId]/page"
import { jest } from "@jest/globals"

// Mock the CountryDetailPage component
jest.mock("@/components/CountryDetailPage", () => ({ countryId }) => (
  <div data-testid="country-detail-page">Country Detail for {countryId}</div>
))

// Mock the useParams hook
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useParams: () => ({ countryId: "USA" }),
}))

// ✅ Mock the useAuth hook
jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    currentUser: { id: "123", name: "Test User" }, // mock data
  }),
}))

describe("Country Detail Page", () => {
  test("renders CountryDetailPage component with correct countryId", () => {
    render(<Page />)

    expect(screen.getByTestId("country-detail-page")).toBeInTheDocument()
    expect(screen.getByText("Country Detail for USA")).toBeInTheDocument()
  })
})
