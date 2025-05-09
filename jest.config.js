const nextJest = require("next/jest")

const createJestConfig = nextJest({
  dir: "./",
})

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/__tests__/app/layout.test.jsx",
    "<rootDir>/__tests__/utils/customMatchers.js",
    "<rootDir>/__tests__/app/country/[countryId]/page.test.jsx",
    "<rootDir>/__tests__/components/Navbar.test.jsx",
    "<rootDir>/__tests__/components/CountryMap.test.jsx",
    "<rootDir>/__tests__/components/CountryDetailPage.test.jsx",
    "<rootDir>/__tests__/components/HomePage.test.jsx",
    "<rootDir>/__tests__/app/register/page.test.jsx",
    "<rootDir>/__tests__/app/favorites/page.test.jsx",
    "<rootDir>/__tests__/contexts/ThemeContext.test.jsx",
  ],
  collectCoverageFrom: [
    "components/**/*.{js,jsx,ts,tsx}",
    "contexts/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
}

module.exports = createJestConfig(customJestConfig)
