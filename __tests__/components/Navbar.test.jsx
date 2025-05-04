import { render, screen, fireEvent } from "@testing-library/react"
import Navbar from "@/components/Navbar"

// Mock the useAuth hook
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    currentUser: null,
    logout: jest.fn(),
  }),
}))

// Mock the useTheme hook
jest.mock("@/contexts/ThemeContext", () => ({
  useTheme: () => ({
    darkMode: false,
    toggleTheme: jest.fn(),
  }),
  ThemeProvider: ({ children }) => <div>{children}</div>,
}))

describe("Navbar", () => {
  test("renders logo and navigation links", () => {
    render(<Navbar />)

    expect(screen.getByText("Country Explorer")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /register/i })).toBeInTheDocument()
  })

  test("renders theme toggle buttons", () => {
    render(<Navbar />)

    // Expect two theme toggle buttons (desktop and mobile)
    const themeButtons = screen.getAllByRole("button", { name: /toggle theme/i })
    expect(themeButtons).toHaveLength(2)
    themeButtons.forEach(button => expect(button).toBeInTheDocument())
  })

  test("toggles mobile menu when menu button is clicked", () => {
    render(<Navbar />)

    // Mobile menu is initially closed, so mobile-specific links should not be visible
    // Assuming mobile menu links are in a container with data-testid="mobile-menu"
    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument()

    // Click the menu button
    fireEvent.click(screen.getByRole("button", { name: /open menu/i }))

    // Mobile menu should now be open, check for mobile menu container
    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /home/i, hidden: false })).toBeInTheDocument()
  })

  test("renders user-specific links when logged in", () => {
    // Mock a logged-in user
    jest.spyOn(require("@/contexts/AuthContext"), "useAuth").mockImplementation(() => ({
      currentUser: { id: "1", username: "testuser" },
      logout: jest.fn(),
    }))

    render(<Navbar />)

    expect(screen.getByText("testuser")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /favorites/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /login/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /register/i })).not.toBeInTheDocument()
  })

  test("calls logout function when logout button is clicked", () => {
    const logoutMock = jest.fn()
    jest.spyOn(require("@/contexts/AuthContext"), "useAuth").mockImplementation(() => ({
      currentUser: { id: "1", username: "testuser" },
      logout: logoutMock,
    }))

    render(<Navbar />)

    fireEvent.click(screen.getByRole("button", { name: /logout/i }))

    expect(logoutMock).toHaveBeenCalled()
  })
})