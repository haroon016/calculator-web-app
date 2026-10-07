import { useState } from 'react'
import CalculatorPanel from './CalculatorPanel'
import { calculateTip } from '../utils/tipCalculator'

const TIP_OPTIONS = [10, 15, 18, 20]
const moneyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function TipField({ id, label, value, onChange, inputMode, suffix, hint, invalid, min }) {
  return (
    <div className="tip-field">
      <label htmlFor={id}>{label}</label>
      <div className="tip-field__input-wrap">
        <input
          id={id}
          type="text"
          inputMode={inputMode}
          autoComplete="off"
          value={value}
          min={min}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${id}-hint tip-error` : `${id}-hint`}
          onChange={(event) => onChange(event.target.value)}
        />
        {suffix && <span aria-hidden="true">{suffix}</span>}
      </div>
      <p id={`${id}-hint`} className="tip-field__hint">{hint}</p>
    </div>
  )
}

export default function TipCalculator() {
  const [bill, setBill] = useState('')
  const [tipPercent, setTipPercent] = useState('15')
  const [people, setPeople] = useState('1')
  const [hasInteracted, setHasInteracted] = useState(false)
  const calculation = calculateTip(bill, tipPercent, people)
  const error = hasInteracted ? calculation.error : ''
  const billInvalid = Boolean(error && error.toLowerCase().includes('bill'))
  const tipInvalid = Boolean(error && (error.toLowerCase().includes('tip percentage') || error.toLowerCase().includes('tip amount')))
  const peopleInvalid = Boolean(error && error.toLowerCase().includes('people'))

  function update(setter) {
    return (value) => {
      setHasInteracted(true)
      setter(value)
    }
  }

  return (
    <CalculatorPanel
      title="Tip Calculator"
      description="Calculate a tip and split the total evenly."
    >
      <div className="tip-calculator">
        <div className="tip-fields">
          <TipField
            id="tip-bill"
            label="Bill amount"
            value={bill}
            onChange={update(setBill)}
            inputMode="decimal"
            suffix="USD"
            hint="Enter zero or a positive amount."
            invalid={billInvalid}
          />

          <fieldset className="tip-presets">
            <legend>Tip percentage</legend>
            <div className="tip-presets__options">
              {TIP_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={tipPercent === String(option)}
                  onClick={() => update(setTipPercent)(String(option))}
                >
                  {option}%
                </button>
              ))}
            </div>
          </fieldset>

          <TipField
            id="tip-custom-percent"
            label="Custom tip percentage"
            value={tipPercent}
            onChange={update(setTipPercent)}
            inputMode="decimal"
            suffix="%"
            hint="You can choose a preset or enter any nonnegative percentage."
            invalid={tipInvalid}
          />

          <TipField
            id="tip-people"
            label="Number of people"
            value={people}
            onChange={update(setPeople)}
            inputMode="numeric"
            hint="Enter a whole number of at least 1."
            invalid={peopleInvalid}
          />
        </div>

        {error ? (
          <p id="tip-error" className="tip-error" role="alert">{error}</p>
        ) : bill.trim() && calculation.tipAmount !== undefined ? (
          <section className="tip-results" aria-labelledby="tip-results-title" aria-live="polite">
            <h3 id="tip-results-title">Bill breakdown</h3>
            <dl>
              <div>
                <dt>Tip amount</dt>
                <dd>{moneyFormat.format(calculation.tipAmount)}</dd>
              </div>
              <div>
                <dt>Total bill</dt>
                <dd>{moneyFormat.format(calculation.totalBill)}</dd>
              </div>
              <div className="tip-results__primary">
                <dt>Amount per person</dt>
                <dd>{moneyFormat.format(calculation.amountPerPerson)}</dd>
              </div>
            </dl>
          </section>
        ) : (
          <p className="tip-prompt">Enter a bill amount to see the tip and split.</p>
        )}
      </div>
    </CalculatorPanel>
  )
}
