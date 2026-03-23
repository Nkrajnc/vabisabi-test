# vabisabi-test

A Playwright end-to-end (E2E) testing project for BTC City Estate property listings web application.

## Overview
This project contains a Playwright end-to-end (E2E) test suite for the BTC City Estate platform.

The suite focuses on **critical user journeys**:
- property discovery (listing)
- filtering behavior
- navigation to detail pages
- basic edge cases and negative scenarios

## Testing Approach

The test suite follows a **risk-based approach**, prioritizing flows that deliver the most business value:

- Property search and filtering (core user flows)
- Property detail navigation
- UI consistency between listing and detail views

Edge cases are included where they provide meaningful coverage, such as:
- restrictive filters returning empty states
- navigation state (back button behavior)

Lower-value areas such as visual polish and deep form validation are intentionally not covered in automation and are better suited for exploratory testing.


## Project Structure
```
├── package.json              # Project metadata and scripts
├── playwright.config.ts      # Playwright configuration
├── tsconfig.json             # TypeScript configuration
├── pages/                    # Page Object Model (POM) classes
│   └── HomePage.ts           # Example HomePage abstraction
├── tests/                    # Test specifications (E2E scenarios)
│   ├── TCID-1.spec.ts        # Test: Property listings render correctly
│   ├── TCID-2.spec.ts        # Test: Filter by Pisarna
│   ├── TCID-3.spec.ts        # Test: Card detail navigation
│   ├── TCID-4.spec.ts        # Test: Restrictive filters show empty state
│   └── TCID-5.spec.ts        # Test: Back navigation preserves filter
├── utils/                    # Test and page helper utilities
│   ├── pageHelpers.ts        # Common page actions (e.g., close popups)
│   └── testHelpers.ts        # Custom assertions and helpers
├── playwright-report/        # Playwright HTML reports (gitignored)
├── test-results/             # Playwright test artifacts (gitignored)
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation
1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd vabisabi-test
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

### Running Tests
- Run all tests in headless mode:
  ```sh
  npx playwright test
  npm test

  ```
- Run tests in headed (UI) mode:
  ```sh
  npx playwright test --headed
  npm run test:headed

  ```
- Open Playwright's interactive UI:
  ```sh
  npx playwright test --ui
  npm run test:ui

  ```
- View the latest HTML report:
  ```sh
  npx playwright show-report
  npm run report
  ```

## Configuration
- **Base URL:** Set via the `BASE_URL` environment variable (defaults to `https://staging.estate.btc-city.com`).
- **Parallelism, retries, and reporting** are configured in [playwright.config.ts](playwright.config.ts).

## Test Scenarios
- **TCID-1:** Validate all property listings render with required elements.
- **TCID-2:** Filtering by "Pisarna" (Office) only shows matching cards.
- **TCID-3:** Each property card opens the correct detail page with valid content.
- **TCID-4:** Applying restrictive filters shows an empty state message.
- **TCID-5:** Back navigation preserves applied filters.

## Utilities
- **Page Helpers:** Common UI actions (e.g., closing popups, locating cards).
- **Test Helpers:** Custom assertions for UI validation.

## Reports & Artifacts
- **playwright-report/**: HTML reports (auto-generated, gitignored)
- **test-results/**: Raw test artifacts (auto-generated, gitignored)

## Contributing
Feel free to open issues or submit pull requests for improvements or new test scenarios.

## License
[ISC](LICENSE)
