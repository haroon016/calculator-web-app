import { useState } from 'react'
import CalculatorPanel from './CalculatorPanel'
import { calculateLoan } from '../utils/loanCalculator'

const moneyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function LoanField({ id, label, value, onChange, suffix, hint, invalid }) {
  return (
    <div className="loan-field">
      <label htmlFor={id}>{label}</label>
      <div className="loan-field__input-wrap">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${id}-hint loan-error` : `${id}-hint`}
          onChange={(event) => onChange(event.target.value)}
        />
        {suffix && <span aria-hidden="true">{suffix}</span>}
      </div>
      <p id={`${id}-hint`} className="loan-field__hint">{hint}</p>
    </div>
  )
}

export default function LoanCalculator() {
  const [amount, setAmount] = useState('')
  const [annualRate, setAnnualRate] = useState('')
  const [termYears, setTermYears] = useState('')
  const calculation = calculateLoan(amount, annualRate, termYears)
  const ready = Boolean(amount.trim() || annualRate.trim() || termYears.trim())
  const error = ready ? calculation.error : ''
  const amountInvalid = Boolean(error && error.toLowerCase().includes('loan amount'))
  const rateInvalid = Boolean(error && error.toLowerCase().includes('interest rate'))
  const termInvalid = Boolean(error && error.toLowerCase().includes('loan term'))

  return (
    <CalculatorPanel
      title="Loan / Mortgage Calculator"
      description="Estimate payments for a standard fixed-rate loan."
    >
      <div className="loan-calculator">
        <form className="loan-form" onSubmit={(event) => event.preventDefault()} noValidate>
          <LoanField
            id="loan-amount"
            label="Loan amount"
            value={amount}
            onChange={setAmount}
            suffix="USD"
            hint="Enter an amount greater than zero."
            invalid={amountInvalid}
          />
          <LoanField
            id="loan-rate"
            label="Annual interest rate"
            value={annualRate}
            onChange={setAnnualRate}
            suffix="%"
            hint="Enter 0 or a positive annual rate."
            invalid={rateInvalid}
          />
          <LoanField
            id="loan-term"
            label="Loan term"
            value={termYears}
            onChange={setTermYears}
            suffix="years"
            hint="Must convert to a whole number of monthly payments."
            invalid={termInvalid}
          />
        </form>

        {error ? (
          <p id="loan-error" className="loan-error" role="alert">{error}</p>
        ) : calculation.monthlyPayment !== undefined ? (
          <section className="loan-results" aria-labelledby="loan-results-title" aria-live="polite">
            <h3 id="loan-results-title">Estimated repayment</h3>
            <dl>
              <div className="loan-results__primary">
                <dt>Monthly payment</dt>
                <dd>{moneyFormat.format(calculation.monthlyPayment)}</dd>
              </div>
              <div>
                <dt>Total amount paid</dt>
                <dd>{moneyFormat.format(calculation.totalPaid)}</dd>
              </div>
              <div>
                <dt>Total interest paid</dt>
                <dd>{moneyFormat.format(calculation.totalInterest)}</dd>
              </div>
            </dl>
            <p className="loan-results__note">
              Estimate for {calculation.paymentCount} monthly payments. Assumes a fixed rate with no fees, taxes, or insurance.
            </p>
          </section>
        ) : (
          <p className="loan-prompt">Enter all three values to see the estimated payment.</p>
        )}
      </div>
    </CalculatorPanel>
  )
}
