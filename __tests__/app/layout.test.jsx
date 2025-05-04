import { render, screen } from "@testing-library/react"
import RootLayout from "@/app/layout"

// Mock the child components
jest.mock("@/components/Navbar", () => () => <div data-testid="navbar">Navbar Component</div>)
jest.mock("@/components/Footer", () => () => <div data-testid="footer">Footer Component</div>)

// Mock the context providers
jest.mock("@/contexts/ThemeProvider", () => ({
  ThemeProvider: ({ children }) => <div data-testid="theme-provider">{children}</div>,
}))

jest.mock("@/contexts/AuthContext", () => ({
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>,
}))

describe("Root Layout", () => {
  test("renders layout with providers, navbar, and footer", () => {
    render(
      <RootLayout>
        <div data-testid="content">Page Content</div>
      </RootLayout>,
    )

    // Check that providers are rendered
    expect(screen.getByTestId("theme-provider")).toBeInTheDocument()
    expect(screen.getByTestId("auth-provider")).toBeInTheDocument()

    // Check that navbar and footer are rendered
    expect(screen.getByTestId("navbar")).toBeInTheDocument()
    expect(screen.getByTestId("footer")).toBeInTheDocument()

    // Check that content is rendered
    expect(screen.getByTestId("content")).toBeInTheDocument()
    expect(screen.getByText("Page Content")).toBeInTheDocument()
  })
})
