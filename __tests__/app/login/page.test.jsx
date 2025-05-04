import { render, screen } from "@testing-library/react"
import Page from "@/app/login/page"

// Mock the LoginPage component
jest.mock("@/components/LoginPage", () => () => <div data-testid="login-page">Login Page Component</div>)

describe("Login Page", () => {
  test("renders LoginPage component", () => {
    render(<Page />)

    expect(screen.getByTestId("login-page")).toBeInTheDocument()
  })
})
