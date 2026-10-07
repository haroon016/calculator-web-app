# App Roles

## Everyday calculation user

A person using a desktop or mobile browser who needs to do a quick arithmetic or scientific calculation is an everyday calculation user. They can switch between Basic, Scientific, Loan / Mortgage, and Tip modes; enter arithmetic with the keypad or keyboard in Basic and Scientific modes; see validation errors; and switch the page between light and dark themes. They must never receive a numeric result for division by zero or invalid scientific operations. Calculations that exceed the finite number range are rejected when detected; extremely small floating-point results may underflow to zero.

## Financial estimate user

A person estimating payments for a fixed-rate loan or working out a restaurant tip and split is a financial estimate user. They can enter the loan amount, annual interest rate, and term to view monthly payment and total estimates, or enter a bill and tip percentage to view the tip, total, and per-person amount. They must never be shown calculated results when required inputs are incomplete or invalid, such as a nonpositive loan amount, negative rate, invalid term, negative bill or tip, or fewer than one person.
