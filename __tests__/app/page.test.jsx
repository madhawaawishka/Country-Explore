import { render } from "@testing-library/react"
import Page from "@/app/page"

// Mock the HomePage component
jest.mock("@/components/HomePage", () => () => <div>Home Page Component</div>)

describe("Home Page", () => {
  test("renders without crashing", () => {
    render(<Page />)
    // If it renders without crashing, the test passes
    expect(true).toBe(true)
  })
})
