import { expect } from "@jest/globals"
// Custom matcher for finding elements by class
expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null
    if (pass) {
      return {
        message: () => `expected ${received} not to be in the document`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected ${received} to be in the document`,
        pass: false,
      }
    }
  },

  // Custom matcher for finding elements by class
  getByClass(container, className) {
    const elements = container.getElementsByClassName(className)
    return elements.length > 0 ? elements[0] : null
  },
})

// Add the getByClass method to screen
import { screen } from "@testing-library/react"
screen.getByClass = function (className) {
  return this.getByClass(document.body, className)
}
