import { useEffect, useReducer, useRef } from 'react'
import CalculatorPanel from './CalculatorPanel'
import { initialScientificState, scientificCalculatorReducer } from '../utils/scientificCalculator'

const keys = [
  { label: 'Clear', action: { type: 'clear' }, style: 'utility', ariaLabel: 'Clear calculator' },
  { label: 'Delete', action: { type: 'backspace' }, style: 'utility', ariaLabel: 'Delete last character' },
  { label: '(', action: { type: 'append', value: '(' }, style: 'utility', ariaLabel: 'Open parenthesis' },
  { label: ')', action: { type: 'append', value: ')' }, style: 'utility', ariaLabel: 'Close parenthesis' },
  { label: '%', action: { type: 'append', value: '%' }, style: 'utility', ariaLabel: 'Percent' },
  { label: '÷', action: { type: 'append', value: '÷' }, style: 'operator', ariaLabel: 'Divide' },
  ...[
    ['sin', 'sin'], ['cos', 'cos'], ['tan', 'tan'], ['log', 'log'], ['ln', 'ln'], ['√', 'sqrt'],
  ].map(([label, value]) => ({ label, action: { type: 'function', value }, style: 'function' })),
  ...['7', '8', '9'].map((value) => ({ label: value, action: { type: 'append', value } })),
  { label: '×', action: { type: 'append', value: '×' }, style: 'operator', ariaLabel: 'Multiply' },
  { label: 'xʸ', action: { type: 'append', value: '^' }, style: 'operator', ariaLabel: 'Power' },
  ...['4', '5', '6'].map((value) => ({ label: value, action: { type: 'append', value } })),
  { label: '−', action: { type: 'append', value: '−' }, style: 'operator', ariaLabel: 'Subtract' },
  { label: 'x²', action: { type: 'square' }, style: 'operator', ariaLabel: 'Square' },
  ...['1', '2', '3'].map((value) => ({ label: value, action: { type: 'append', value } })),
  { label: '+', action: { type: 'append', value: '+' }, style: 'operator', ariaLabel: 'Add' },
  { label: '±', action: { type: 'sign' }, style: 'utility', ariaLabel: 'Negate expression' },
  { label: '0', action: { type: 'append', value: '0' } },
  { label: '.', action: { type: 'append', value: '.' }, ariaLabel: 'Decimal point' },
  { label: '=', action: { type: 'equals' }, style: 'equals', ariaLabel: 'Calculate result' },
]

export default function ScientificCalculator() {
  const [state, dispatch] = useReducer(scientificCalculatorReducer, initialScientificState)
  const calculatorRef = useRef(null)

  function handleKeyboardEvent(event) {
    if (event.ctrlKey || event.metaKey || event.altKey) return
    if (event.target instanceof HTMLInputElement && (/^\d$/.test(event.key) || /^[a-z]$/i.test(event.key) || ['.', ',', '(', ')'].includes(event.key))) return false

    const keyActions = {
      Enter: { type: 'equals' },
      '=': { type: 'equals' },
      Backspace: { type: 'backspace' },
      Escape: { type: 'clear' },
      Delete: { type: 'clear' },
      '.': { type: 'append', value: '.' },
      ',': { type: 'append', value: '.' },
      '%': { type: 'append', value: '%' },
      '+': { type: 'append', value: '+' },
      '-': { type: 'append', value: '−' },
      '*': { type: 'append', value: '×' },
      '/': { type: 'append', value: '÷' },
      '^': { type: 'append', value: '^' },
      '(': { type: 'append', value: '(' },
      ')': { type: 'append', value: ')' },
    }
    if (/^\d$/.test(event.key)) keyActions[event.key] = { type: 'append', value: event.key }

    const action = keyActions[event.key]
    if (!action) return false
    event.preventDefault()
    dispatch(action)
    return true
  }

  useEffect(() => {
    function onWindowKeyDown(event) {
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable="true"]')) return
      if (calculatorRef.current?.closest('[hidden]')) return
      handleKeyboardEvent(event)
    }
    window.addEventListener('keydown', onWindowKeyDown)
    return () => window.removeEventListener('keydown', onWindowKeyDown)
  }, [])

  return (
    <CalculatorPanel
      title="Scientific Calculator"
      description="Enter an expression or use the keypad. Trigonometric functions use degrees."
    >
      <div className="scientific-calculator" ref={calculatorRef}>
        <div className="calculator-display scientific-display">
          <label className="visually-hidden" htmlFor="scientific-expression">Scientific expression</label>
          <input
            id="scientific-expression"
            className="scientific-expression"
            type="text"
            inputMode="text"
            autoComplete="off"
            spellCheck="false"
            aria-label="Scientific expression"
            aria-invalid={Boolean(state.error)}
            aria-describedby="scientific-result scientific-error"
            value={state.expression}
            onChange={(event) => dispatch({ type: 'input', value: event.target.value.replace(',', '.') })}
            onKeyDown={handleKeyboardEvent}
            onFocus={(event) => event.target.select()}
          />
          <output id="scientific-result" className="scientific-result" aria-live="polite">
            {state.result ?? '\u00a0'}
          </output>
          <p id="scientific-error" className="calculator-display__error" role="status" aria-live="polite">
            {state.error || '\u00a0'}
          </p>
        </div>
        <div className="calculator-keypad scientific-keypad" aria-label="Scientific calculator keypad">
          {keys.map(({ label, action, style = '', ariaLabel }) => (
            <button
              key={label}
              type="button"
              className={`calculator-key ${style ? `calculator-key--${style}` : ''}`}
              aria-label={ariaLabel || label}
              onClick={() => dispatch(action)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="calculator-hint">Use ^ for powers, % for a value divided by 100, and parentheses to group operations.</p>
      </div>
    </CalculatorPanel>
  )
}
