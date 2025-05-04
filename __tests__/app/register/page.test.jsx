import { render, screen } from "@testing-library/react"
import Page from "@/app/register/page"
import { jest } from "@jest/globals"

// Mock the RegisterPage component
jest.mock("@/components/RegisterPage", () => () => <div data-testid="register-page">Register Page Component</div>)

describe("Register Page", () => {
  test("renders RegisterPage component", () => {
    render(<Page />)

    expect(screen.getByTestId("register-page")).toBeInTheDocument()
  })
})
