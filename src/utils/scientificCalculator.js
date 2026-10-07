import { evaluateScientificExpression } from './scientificExpression'

export const initialScientificState = {
  expression: '0',
  result: null,
  error: '',
  evaluated: false,
  negated: false,
}

function startsNewExpression(token) {
  return /^\d$/.test(token) || token === '.' || token === '(' || /^[a-z]+\($/i.test(token)
}

export function scientificCalculatorReducer(state, action) {
  if (action.type === 'clear') return initialScientificState

  if (action.type === 'input') {
    if (action.value.length > 160) return state
    return { ...state, expression: action.value, result: null, error: '', evaluated: false, negated: false }
  }

  if (action.type === 'backspace') {
    return {
      ...state,
      expression: state.expression.slice(0, -1) || '0',
      result: null,
      error: '',
      evaluated: false,
      negated: false,
    }
  }

  if (state.error) {
    if (action.type === 'append' && startsNewExpression(action.value)) {
      return { ...initialScientificState, expression: action.value === '.' ? '0.' : action.value }
    }
    return state
  }

  if (action.type === 'equals') {
    try {
      const result = evaluateScientificExpression(state.expression)
      return { ...state, result, error: '', evaluated: true, negated: false }
    } catch (error) {
      return { ...state, result: null, error: error instanceof Error ? error.message : 'Unable to calculate this expression.', evaluated: false }
    }
  }

  if (action.type === 'sign') {
    const sourceExpression = state.evaluated && state.result !== null ? state.result : state.expression
    if (!sourceExpression || sourceExpression === '0') return state
    if (state.negated && sourceExpression.startsWith('-(') && sourceExpression.endsWith(')')) {
      return { ...state, expression: state.expression.slice(2, -1), result: null, evaluated: false, negated: false }
    }
    return { ...state, expression: `-(${sourceExpression})`, result: null, evaluated: false, negated: true }
  }

  if (action.type === 'square') action = { type: 'append', value: '^2' }
  if (action.type === 'function') action = { type: 'append', value: `${action.value}(` }

  if (action.type === 'append') {
    const token = action.value
    const isOperator = ['+', '−', '×', '÷', '^'].includes(token)
    const isContinuation = isOperator || token === '%' || token.startsWith('^')
    let expression = state.expression

    if (state.evaluated && !isContinuation) {
      expression = startsNewExpression(token) ? (token === '.' ? '0.' : token) : expression
    } else if (state.evaluated && state.result !== null) {
      expression = state.result
    }

    if (state.evaluated && !isOperator && token === '%') expression = state.result ?? expression

    if (token === '.') {
      const currentNumber = expression.match(/(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i)?.[0] ?? ''
      if (currentNumber.includes('.')) return { ...state, expression, result: null, evaluated: false }
      const next = expression.endsWith(')') ? `${expression}×0.`
        : /\d$/.test(expression) ? `${expression}.`
          : `${expression}0.`
      return { ...state, expression: next, result: null, error: '', evaluated: false, negated: false }
    }

    if (isOperator && /[+−×÷^]$/.test(expression)) {
      if (token === '−' && /[×÷^]$/.test(expression)) expression += token
      else expression = `${expression.slice(0, -1)}${token}`
      return { ...state, expression, result: null, error: '', evaluated: false, negated: false }
    }

    if (expression === '0' && /^\d$/.test(token)) expression = token
    else if (expression === '0' && token === '(') expression = token
    else if (expression === '0' && /^[a-z]+\($/i.test(token)) expression = token
    else if ((/^\d$/.test(token) || token === '(' || /^[a-z]+\($/i.test(token)) && /(?:\d|\)|%)$/.test(expression)) expression += `×${token}`
    else expression += token

    return { ...state, expression, result: null, error: '', evaluated: false, negated: false }
  }

  return state
}
