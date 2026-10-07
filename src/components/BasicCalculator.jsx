import { useEffect, useReducer, useRef } from 'react'
import CalculatorPanel from './CalculatorPanel'
import {
  basicCalculatorReducer,
  getPendingExpression,
  initialCalculatorState,
} from '../utils/basicCalculator'

const keys = [
  { label: 'Clear', action: { type: 'clear' }, style: 'utility', ariaLabel: 'Clear calculator' },
  { label: '±', action: { type: 'sign' }, style: 'utility', ariaLabel: 'Toggle positive or negative' },
  { label: '%', action: { type: 'percent' }, style: 'utility', ariaLabel: 'Convert to percent' },
  { label: '÷', action: { type: 'operator', value: '÷' }, style: 'operator', ariaLabel: 'Divide' },
  ...['7', '8', '9'].map((value) => ({ label: value, action: { type: 'digit', value } })),
  { label: '×', action: { type: 'operator', value: '×' }, style: 'operator', ariaLabel: 'Multiply' },
  ...['4', '5', '6'].map((value) => ({ label: value, action: { type: 'digit', value } })),
  { label: '−', action: { type: 'operator', value: '−' }, style: 'operator', ariaLabel: 'Subtract' },
  ...['1', '2', '3'].map((value) => ({ label: value, action: { type: 'digit', value } })),
  { label: '+', action: { type: 'operator', value: '+' }, style: 'operator', ariaLabel: 'Add' },
  { label: 'Delete', action: { type: 'backspace' }, style: 'utility', ariaLabel: 'Delete last digit' },
  { label: '0', action: { type: 'digit', value: '0' }, className: 'calculator-key--zero' },
  { label: '.', action: { type: 'decimal' }, ariaLabel: 'Decimal point' },
  { label: '=', action: { type: 'equals' }, style: 'equals', ariaLabel: 'Calculate result' },
]

export default function BasicCalculator() {
  const [state, dispatch] = useReducer(basicCalculatorReducer, initialCalculatorState)
  const panelRef = useRef(null)
  const expression = getPendingExpression(state)

  function handleKeyboardEvent(event) {
    if (event.ctrlKey || event.metaKey || event.altKey) return
    if (event.target instanceof HTMLInputElement && (/^\d$/.test(event.key) || event.key === '.' || event.key === ',')) return false

    const actions = {
      Enter: { type: 'equals' },
      '=': { type: 'equals' },
      Backspace: { type: 'backspace' },
      Escape: { type: 'clear' },
      Delete: { type: 'clear' },
      '.': { type: 'decimal' },
      ',': { type: 'decimal' },
      '%': { type: 'percent' },
      '+': { type: 'operator', value: '+' },
      '-': { type: 'operator', value: '−' },
      '*': { type: 'operator', value: '×' },
      '/': { type: 'operator', value: '÷' },
    }

    if (/^\d$/.test(event.key)) actions[event.key] = { type: 'digit', value: event.key }
    const action = actions[event.key]
    if (!action) return false
    event.preventDefault()
    dispatch(action)
    return true
  }

  useEffect(() => {
    function onWindowKeyDown(event) {
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable="true"]')) return
      if (panelRef.current?.closest('[hidden]')) return
      handleKeyboardEvent(event)
    }

    window.addEventListener('keydown', onWindowKeyDown)
    return () => window.removeEventListener('keydown', onWindowKeyDown)
  }, [])

  return (
    <CalculatorPanel
      title="Basic Calculator"
      description="Everyday arithmetic, all in one place."
    >
      <div className="basic-calculator" ref={panelRef}>
        <div className="calculator-display" aria-label="Calculator display">
          <p className="calculator-display__expression" aria-live="polite">{expression || '\u00a0'}</p>
          <label className="visually-hidden" htmlFor="basic-calculator-input">Current calculator value</label>
          <input
            id="basic-calculator-input"
            className="calculator-display__value"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            spellCheck="false"
            aria-invalid={Boolean(state.error)}
            aria-describedby="basic-calculator-error"
            value={state.error ? 'Error' : state.entry}
            onChange={(event) => dispatch({ type: 'input', value: event.target.value.replace(',', '.') })}
            onKeyDown={handleKeyboardEvent}
            onFocus={(event) => event.target.select()}
          />
          <p id="basic-calculator-error" className="calculator-display__error" role="status" aria-live="polite">
            {state.error || '\u00a0'}
          </p>
        </div>
        <div className="calculator-keypad" aria-label="Calculator keypad">
          {keys.map(({ label, action, style = '', className = '', ariaLabel }) => (
            <button
              key={label}
              type="button"
              className={`calculator-key ${style ? `calculator-key--${style}` : ''} ${className}`}
              aria-label={ariaLabel || label}
              onClick={() => dispatch(action)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="calculator-hint">Percentage converts the current number to a decimal fraction.</p>
      </div>
    </CalculatorPanel>
  )
}
