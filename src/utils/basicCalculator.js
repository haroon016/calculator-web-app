import { formatCalculatorNumber } from './numberFormatting.js'

const OPERATORS = {
  '+': (left, right) => left + right,
  '−': (left, right) => left - right,
  '×': (left, right) => left * right,
  '÷': (left, right) => left / right,
}

const MAX_ENTRY_LENGTH = 16

export const initialCalculatorState = {
  entry: '0',
  accumulator: null,
  operator: null,
  waitingForOperand: false,
  evaluated: false,
  expression: '',
  error: '',
}

function getOperand(entry) {
  if (typeof entry !== 'string' || entry.trim() === '' || entry === '-' || entry === '.' || entry === '-.') return null
  const value = Number(entry)
  return Number.isFinite(value) ? value : null
}

function calculate(left, operator, right) {
  if (!Object.hasOwn(OPERATORS, operator)) return { error: 'Invalid operation.' }
  if (operator === '÷' && right === 0) return { error: 'Cannot divide by zero.' }

  const result = OPERATORS[operator](left, right)
  const entry = formatCalculatorNumber(result)
  return entry === null ? { error: 'Result is outside the supported range.' } : { entry }
}

export function basicCalculatorReducer(state, action) {
  if (action.type === 'clear') return initialCalculatorState

  if (state.error) {
    if (action.type === 'input' && action.value !== '') {
      if (/^-?\d*\.?\d*$/.test(action.value)) {
        return { ...initialCalculatorState, entry: action.value }
      }
      return state
    }
    if (action.type === 'digit') {
      return { ...initialCalculatorState, entry: action.value }
    }
    if (action.type === 'decimal') return { ...initialCalculatorState, entry: '0.' }
    return state
  }

  switch (action.type) {
    case 'input': {
      if (action.value.length > MAX_ENTRY_LENGTH + 1 || !/^-?\d*\.?\d*$/.test(action.value)) return state
      return {
        ...state,
        entry: action.value,
        waitingForOperand: false,
        evaluated: false,
        expression: '',
      }
    }
    case 'digit': {
      if (state.evaluated) return { ...initialCalculatorState, entry: action.value }
      const baseState = state.waitingForOperand ? { ...state, entry: '0', waitingForOperand: false } : state
      if (baseState.entry.replace('-', '').replace('.', '').length >= MAX_ENTRY_LENGTH) return baseState
      const entry = baseState.entry === '0' ? action.value : `${baseState.entry}${action.value}`
      return { ...baseState, entry, expression: '' }
    }
    case 'decimal': {
      if (state.evaluated) return { ...initialCalculatorState, entry: '0.' }
      const baseState = state.waitingForOperand ? { ...state, entry: '0', waitingForOperand: false } : state
      if (baseState.entry.includes('.')) return baseState
      return { ...baseState, entry: `${baseState.entry}.`, expression: '' }
    }
    case 'operator': {
      const operand = getOperand(state.entry)
      if (operand === null) return { ...state, error: 'Enter a valid number.' }

      if (state.operator && !state.waitingForOperand) {
        const result = calculate(state.accumulator, state.operator, operand)
        if (result.error) return { ...state, error: result.error }
        return {
          ...state,
          entry: result.entry,
          accumulator: Number(result.entry),
        operator: action.value,
        waitingForOperand: true,
        evaluated: false,
        expression: `${result.entry} ${action.value}`,
        }
      }

      return {
        ...state,
        accumulator: operand,
        operator: action.value,
        waitingForOperand: true,
        evaluated: false,
        expression: `${state.entry} ${action.value}`,
      }
    }
    case 'equals': {
      if (!state.operator || state.accumulator === null || state.waitingForOperand) return state
      const right = getOperand(state.entry)
      if (right === null) return { ...state, error: 'Enter a valid number.' }
      const result = calculate(state.accumulator, state.operator, right)
      if (result.error) return { ...state, error: result.error }
      return {
        ...initialCalculatorState,
        entry: result.entry,
        evaluated: true,
        expression: `${state.accumulator} ${state.operator} ${state.entry} =`,
      }
    }
    case 'percent': {
      const value = getOperand(state.entry)
      if (value === null) return { ...state, error: 'Enter a valid number.' }
      const entry = formatCalculatorNumber(value / 100)
      return entry === null ? { ...state, error: 'Result is outside the supported range.' } : { ...state, entry, waitingForOperand: false, expression: '' }
    }
    case 'sign': {
      if (state.entry === '0') return state
      return { ...state, entry: state.entry.startsWith('-') ? state.entry.slice(1) : `-${state.entry}`, expression: '' }
    }
    case 'backspace': {
      if (state.waitingForOperand) return state
      const entry = state.entry.length <= 1 || (state.entry.length === 2 && state.entry.startsWith('-'))
        ? '0'
        : state.entry.slice(0, -1)
      return { ...state, entry, expression: '' }
    }
    default:
      return state
  }
}

export function getPendingExpression(state) {
  if (!state.operator || state.accumulator === null) return state.expression
  return state.waitingForOperand
    ? `${state.accumulator} ${state.operator}`
    : `${state.accumulator} ${state.operator} ${state.entry}`
}
