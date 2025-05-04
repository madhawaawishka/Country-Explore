import { render, screen } from "@testing-library/react"
import Page from "@/app/page"

// Mock the HomePage component
jest.mock("@/components/HomePage", () => () => <div data-testid="home-page">Home Page Component</div>)

describe("Page Component", () => {
  it("should render the HomePage component", () => {
    render(<Page />)
    
    const homePageElement = screen.getByTestId("home-page")
    expect(homePageElement).toBeInTheDocument()
  })
})