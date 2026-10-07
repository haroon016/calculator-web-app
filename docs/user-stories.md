# User Stories

## User Story S-1

**Job:** J-1  
**Status:** Implemented

"As an everyday calculation user, I want to work through arithmetic with decimals, percentages, or negative values, so that I can get a reliable result for the decision in front of me."

### Acceptance Criteria

- Given the application has just opened, when the user views the calculator, then Basic is selected and the current value is `0`.
- Given the user enters `12`, selects `+`, enters `3`, and selects equals, when the operation completes, then the display shows `15`.
- Given the user enters `0.1 + 0.2`, when they select equals, then the display shows `0.3`.
- Given the user enters `8`, selects `+` and then `×`, enters `2`, and selects equals, when the operation completes, then the pending `+` is replaced and the display shows `16`.
- Given the user enters `2 + 3 × 4`, when they select equals, then the display shows `20`, because Basic mode applies operations sequentially from left to right.
- Given the current value is `25`, when the user selects `%` and then `±`, then the current value becomes `-0.25`.
- Given the user has calculated `2 + 3 = 5`, when they select `×`, enter `4`, and select equals, then the display shows `20`.
- Given the user has calculated `2 + 3 = 5`, when they enter a digit instead of an operator, then that digit starts a new calculation.
- Given `8 +` is pending with no second operand, when the user selects equals, then the incomplete operation is left unchanged and no numeric result is produced.
- Given the user enters `8 ÷ 0` and selects equals, when the operation is evaluated, then the app displays a division-by-zero error instead of a numeric result; when the user enters `7`, then the error clears and the current value is `7`.
- Given the user has entered a value, when they select Clear, then the display returns to `0` and any pending operation or error is removed.
- Given the current value is `123`, when the user selects Delete or presses Backspace, then the current value becomes `12`.
- Given Basic mode is active and the calculator input is not focused, when the user presses `2`, `+`, `3`, and Enter, then the display shows `5`.
- Given the keypad contains a 16-digit value, when the user presses another digit, then the extra digit is ignored and the displayed value remains unchanged.
- Given the current value is `5`, when the user types malformed text such as `5x` into the editable value field, then the invalid text is rejected and the prior valid value remains displayed.

## User Story S-2

**Job:** J-2  
**Status:** Implemented

"As an everyday calculation user, I want to calculate powers, roots, trigonometric values, logarithms, and grouped operations, so that I can get the value of the expression I am working with."

### Acceptance Criteria

- Given the Scientific calculator is selected and the expression is `2 + 3 × 4`, when the user evaluates it, then the result is `14`.
- Given the expression is `(2 + 3) × 4`, when the user evaluates it, then the result is `20`.
- Given the expression is `2^3^2`, when the user evaluates it, then the result is `512` (powers associate from right to left).
- Given the expression is `sqrt(9)`, `5^2`, or `25%`, when each is evaluated, then the respective result is `3`, `25`, or `0.25`.
- Given the expressions are `sin(30)`, `cos(60)`, and `tan(45)`, when evaluated, then the results are respectively `0.5`, `0.5`, and `1`; the angles are interpreted as degrees.
- Given the expressions are `log(100)` and `ln(1)`, when evaluated, then the results are respectively `2` and `0` (`log` is base 10; `ln` is natural logarithm).
- Given the user evaluates `2 + 3` and receives `5`, when they append `+ 2` and evaluate again, then the result is `7`; when they instead start with a digit, then that digit begins a new expression.
- Given the expression is `2 + 3`, when the user selects `±` and evaluates it, then the result is `-5`.
- Given the expression is `123`, when the user deletes one character with Backspace, then the expression becomes `12`.
- Given Scientific mode is active and its expression input is not focused, when the user presses `2`, `+`, `3`, and Enter, then the result is `5`.
- Given the user evaluates `sqrt(-1)`, `log(0)`, `ln(-2)`, `1/0`, or `tan(90)`, when each expression is evaluated, then the app displays an explanatory error and no numeric result.
- Given the expression is incomplete (`1+`) or has an unmatched opening parenthesis (`(1+2`), when the user evaluates it, then the app displays an incomplete-expression or missing-parenthesis error.
- Given the expression is `unknown(2)`, when the user evaluates it, then the app reports an unknown function rather than returning a result.
- Given the expression is `1e308`, when it is evaluated, then a finite result is displayed; given the expression is `1e309` or `1e-999`, when it is evaluated, then the app reports that the number is too large or too small to represent.
- Given the expression is `1e-300×1e-300` or `9^9999`, when it is evaluated, then the app reports an underflow or out-of-range error rather than displaying `0`, `Infinity`, or `NaN` as a valid result.
- Given an expression has produced an error, when the user selects Clear and enters `4`, then the error clears and the new expression can be evaluated to `4`.

## User Story S-3

**Job:** J-3  
**Status:** Implemented

"As a financial estimate user, I want to estimate the monthly payment and total repayment for a fixed-rate loan, so that I can plan for the expected cost in my budget."

### Acceptance Criteria

- Given the user enters a loan amount of `100000`, annual interest rate of `6`, and term of `30` years, when all three values are valid, then the app automatically displays a monthly payment of `$599.55`, total amount paid of `$215,838.19`, and total interest paid of `$115,838.19`.
- Given the user enters a loan amount of `12000`, annual rate of `0`, and term of `10` years, when all three values are valid, then the monthly payment is `$100.00`, total paid is `$12,000.00`, and total interest is `$0.00`.
- Given the loan amount is `0.01`, the annual rate is `0`, and the term is `1` year, when all values are valid, then the app displays a finite estimate for 12 monthly payments.
- Given the user enters `10000`, `5`, and `1.5` years, when all values are valid, then the app calculates an estimate for 18 monthly payments.
- Given the loan amount is `100000`, the annual interest rate is `6%`, and the loan term is empty, when the user enters the amount and rate, then the app displays `Enter a loan term.` and no repayment results.
- Given the loan amount is `100000`, the annual interest rate is `6%`, and the loan term is `30` years, when the user changes the loan amount to `0` or `-1`, then the app displays `Loan amount must be greater than zero.` and no repayment results.
- Given the loan amount is `100000` and the loan term is `30` years, when the user enters an annual interest rate of `-1%`, then the app displays `Interest rate cannot be negative.` and no repayment results.
- Given the loan amount is `100000` and the annual interest rate is `6%`, when the user enters a loan term of `0` or `-1` years, then the app displays `Loan term must be greater than zero.` and no repayment results.
- Given a field contains malformed text such as `$100000`, when the value is entered, then the app reports invalid numeric input rather than displaying `NaN` or an estimate.
- Given the loan amount is `1.001`, the annual interest rate is `6%`, and the loan term is `30` years, when the user enters these values, then the app displays `Loan amount cannot include fractions smaller than one cent.` and no repayment results.
- Given the loan amount is `100000`, the annual interest rate is `6%`, and the loan term is `0.1` years, when the user enters these values, then the app displays `Loan term must convert to a whole number of monthly payments.` and no repayment results.
- Given the loan amount is the 308-digit number consisting of all `9`s, the annual interest rate is `100%`, and the loan term is `30` years, when the user enters all three values and the calculation updates, then the app displays `These values are outside the supported calculation range.` and no repayment results.
- Given an invalid value has caused an error, when the user corrects it so the amount, rate, and term are valid, then the error clears and the repayment results update automatically without a separate submit action.
- Given results are displayed, when the user reads them, then all three monetary outputs use USD formatting with two fractional digits and the note identifies the estimate as fixed-rate with no fees, taxes, or insurance.

## User Story S-4

**Job:** J-4  
**Status:** Implemented

"As a financial estimate user, I want to work out the tip and divide the total across the group, so that I can understand each person's share."

### Acceptance Criteria

- Given the bill is `84.50`, the tip percentage is `18`, and the number of people is `3`, when the values are valid, then the app displays a `$15.21` tip, `$99.71` total bill, and `$33.24` per person.
- Given the user selects each provided preset, when the selection changes, then the custom percentage field reflects `10`, `15`, `18`, or `20` percent and the results update when a bill is present.
- Given the user enters a custom percentage of `12.5`, a bill of `100`, and one person, when the values are valid, then the app displays a `$12.50` tip, `$112.50` total, and `$112.50` per person.
- Given the bill is `0`, the tip percentage is `15`, and there is one person, when the values are valid, then the app displays `$0.00` for tip, total, and per-person amount.
- Given the bill is `1.005` and the tip percentage is `10`, when the values are valid, then the bill is rounded to `$1.01`, the tip to `$0.10`, and the total is `$1.11`.
- Given the bill field is empty, when the user has not entered a bill, then the app shows a prompt and does not display a calculated breakdown.
- Given the bill amount is `100`, the tip percentage is `15%`, and the number of people is `2`, when the user changes the tip percentage to `-1%`, then the app displays `Tip percentage cannot be negative.` and no calculated breakdown.
- Given the bill amount is `100` and the tip percentage is `15%`, when the user enters `0` as the number of people, then the app displays `Number of people must be a whole number of at least 1.` and no calculated breakdown.
- Given the tip percentage is `15%` and the number of people is `2`, when the user changes the bill amount to `-1`, then the app displays `Bill amount cannot be negative.` and no calculated breakdown.
- Given the number of people is a decimal such as `2.5`, when the value is entered, then the app reports that the number must be a whole number of at least one.
- Given the bill, tip percentage, or people field contains malformed text, when the value is entered, then the app displays a validation error rather than a misleading monetary result.
- Given the number of people exceeds the safe integer range (for example, `9007199254740992`), when the value is entered, then the app reports an invalid people count and displays no breakdown.
- Given a bill or calculated tip exceeds the supported monetary range, when the values are entered, then the app displays a range validation error and does not display `NaN` or `Infinity` as a result.
- Given an invalid entry has caused an error, when the user corrects the entry to valid values, then the error clears and the tip, total, and per-person amount update automatically.

## Coverage and limitations

All four documented jobs (J-1 through J-4) have at least one implemented user story. These stories cover the calculator behavior and validation currently present in the source. They do not claim constants such as π or e, implicit multiplication in manually typed scientific expressions, saved history, currency selection, or non-fixed-rate loan calculations; those capabilities are not implemented.
