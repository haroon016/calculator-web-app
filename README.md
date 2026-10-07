# Everyday Calculator

Everyday Calculator is a small, browser-based calculator app with four focused modes: basic arithmetic, scientific calculations, fixed-rate loan estimates, and tip splitting. It opens in Basic mode and lets you switch modes without leaving or reloading the page.

## Who it is for

The app is for people who want a quick way to handle common calculations in one place, including students, households, and anyone estimating a loan payment or splitting a restaurant bill. It was chosen as a take-home project because it combines familiar arithmetic with distinct input and validation needs, while remaining small enough to build and review without a backend or external services.

## Features

- Four calculator modes in a single-page interface, with Basic selected by default.
- Light and dark themes.
- Responsive layout with on-screen controls and keyboard input for the Basic and Scientific calculators.
- Clear validation messages for invalid values and unsupported calculations.
- Calculation logic separated into utility modules and covered by focused automated tests.
- Runs locally in the browser; no backend, API keys, or external calculator service is used.

## Calculator modes

### Basic

Addition, subtraction, multiplication, division, decimal values, percentage conversion, sign toggle, clear, backspace, and equals. Percentage converts the current number to its decimal fraction (for example, `25` becomes `0.25`). Division by zero and out-of-range results show an error. Keyboard shortcuts include digits, `+`, `-`, `*`, `/`, `%`, decimal point, Enter/`=`, Backspace, Escape, and Delete.

### Scientific

Arithmetic expressions with precedence and parentheses, decimal values, percentage, square root, square, powers, sign toggle, `sin`, `cos`, `tan`, `log`, and `ln`. Trigonometric functions use **degrees**. `log` is base 10 and `ln` is the natural logarithm. The expression parser rejects malformed expressions, invalid function domains, division by zero, and values outside the supported numeric range. Keyboard input and the on-screen keypad are supported.

### Loan / Mortgage

Calculates estimated monthly payment, total paid, and total interest for a standard fixed-rate amortizing loan. The annual percentage rate is converted to a monthly rate, and the term must result in a whole number of monthly payments. A 0% rate is handled separately. Amounts display in USD. The estimate excludes fees, taxes, and insurance.

### Tip

Calculates tip amount, total bill, and amount per person. Includes 10%, 15%, 18%, and 20% presets, a custom nonnegative percentage, and a people count of at least one. Currency displays in USD; the bill and tip are rounded to cents before the total is calculated.

## Technology

- React 19
- Vite 8
- JavaScript (ES modules)
- CSS
- Node.js built-in test runner (`node:test`)
- Oxlint

All calculation and rendering run in the browser. There is no server-side application component.

## Prerequisites

- Node.js **20.19 or newer in the 20.x line**, or **22.12 or newer**.
- npm (included with Node.js).

## Install and run

From the project directory:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite in the terminal.

## Use the application

1. The app opens with **Basic** selected. Use the calculator buttons or keyboard to enter and calculate an expression.
2. Choose **Scientific**, **Loan / Mortgage**, or **Tip** in the navigation at the top to switch modes without a page reload.
3. In Scientific mode, enter an expression directly or use the keypad. Use parentheses to group operations; trigonometric inputs are in degrees.
4. In Loan / Mortgage mode, enter the loan amount, annual interest rate, and term in years. The term must correspond to a whole number of monthly payments (for example, 15 years or 1.5 years).
5. In Tip mode, enter the bill and number of people, then select a preset or enter a custom tip percentage.
6. Use the theme control beside the page heading to switch between light and dark appearance.

Calculator entries are kept while switching modes for the current page session. Reloading the page resets them and returns to Basic mode.

## Tests, lint, and production build

Run the automated calculation tests:

```sh
npm test
```

Run the linter:

```sh
npm run lint
```

Create a production build:

```sh
npm run build
```

The build output is written to `dist/`. To serve that build locally for a production-like check, run `npm run preview` after building.

## AI assistance and authorship

- **AI coding tool:** OpenAI Codex.
- **AI model:** GPT-6 (as provided in the Codex coding session).
- **Author's manual changes:** Updated the page title to “Calculator Web App” and replaced the favicon with a custom image (`public/favicon.jpg`).

The author should review and be prepared to explain all code and calculations in this project.

## Assumptions

- The loan calculator estimates a fixed annual interest rate over regular monthly payments. It does not model lender-specific rounding, fees, taxes, insurance, or payment schedule variations.
- The loan term must convert to a whole number of months.
- Loan and tip amounts are shown in USD; there is no currency selector or exchange-rate conversion.
- Basic mode's percentage key divides the current value by 100. Scientific mode accepts `%` as a postfix operator that divides the preceding value by 100.
- The tip calculator rounds the entered bill to cents, calculates and rounds the tip to cents, then adds those amounts. The per-person share is divided evenly and formatted as currency, so displayed rounded shares may not sum to the displayed total when the split has a remainder.

## Known limitations

- Values and theme selection are not saved across page reloads.
- Tests cover calculation utilities, not rendered UI or real browser/device behavior. Verify layout, keyboard behavior, and assistive technology support in target browsers before relying on them.
- The app requires a modern browser and the supported Node.js version to build. Internet Explorer is not supported.
- Financial results are estimates for the stated assumptions, not lender quotes or payment instructions.
# calculator-web-app
