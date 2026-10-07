const DECIMAL_INPUT = /^-?(?:\d+(?:\.\d*)?|\.\d+)$/

function parseNonNegativeDecimal(value) {
  const normalized = value.trim()
  if (!DECIMAL_INPUT.test(normalized)) return null
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

export function calculateLoan(amountInput, annualRateInput, termYearsInput) {
  if (!amountInput.trim()) return { error: 'Enter a loan amount.' }
  if (!annualRateInput.trim()) return { error: 'Enter an annual interest rate.' }
  if (!termYearsInput.trim()) return { error: 'Enter a loan term.' }

  const principal = parseNonNegativeDecimal(amountInput)
  const annualRatePercent = parseNonNegativeDecimal(annualRateInput)
  const termYears = parseNonNegativeDecimal(termYearsInput)

  if (principal === null) return { error: 'Enter a valid loan amount using digits and a decimal point.' }
  if (principal <= 0) return { error: 'Loan amount must be greater than zero.' }
  const amountFraction = amountInput.trim().match(/\.(\d*)$/)?.[1] ?? ''
  if (/[1-9]/.test(amountFraction.slice(2))) {
    return { error: 'Loan amount cannot include fractions smaller than one cent.' }
  }
  if (annualRatePercent === null) return { error: 'Enter a valid annual interest rate using digits and a decimal point.' }
  if (annualRatePercent < 0) return { error: 'Interest rate cannot be negative.' }
  if (termYears === null) return { error: 'Enter a valid loan term using digits and a decimal point.' }
  if (termYears <= 0) return { error: 'Loan term must be greater than zero.' }

  const paymentCountExact = termYears * 12
  const paymentCount = Math.round(paymentCountExact)
  if (!Number.isSafeInteger(paymentCount) || paymentCount <= 0 || Math.abs(paymentCountExact - paymentCount) > 1e-9) {
    return { error: 'Loan term must convert to a whole number of monthly payments.' }
  }

  const monthlyRate = annualRatePercent / 100 / 12
  let monthlyPayment

  if (monthlyRate === 0) {
    monthlyPayment = principal / paymentCount
  } else {
    const denominator = -Math.expm1(-paymentCount * Math.log1p(monthlyRate))
    monthlyPayment = (principal * monthlyRate) / denominator
  }

  const totalPaid = monthlyPayment * paymentCount
  const totalInterest = totalPaid - principal

  if (![monthlyPayment, totalPaid, totalInterest].every(Number.isFinite)) {
    return { error: 'These values are outside the supported calculation range.' }
  }

  return {
    monthlyPayment,
    totalPaid,
    totalInterest: Math.max(0, totalInterest),
    paymentCount,
  }
}
