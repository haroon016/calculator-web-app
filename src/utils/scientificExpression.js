import { formatCalculatorNumber } from './numberFormatting.js'

const FUNCTIONS = new Set(['sqrt', 'sin', 'cos', 'tan', 'log', 'ln'])

function tokenize(source) {
  const tokens = []
  let remaining = source.replaceAll('×', '*').replaceAll('÷', '/').replaceAll('−', '-')

  while (remaining.length > 0) {
    const whitespace = remaining.match(/^\s+/)
    if (whitespace) {
      remaining = remaining.slice(whitespace[0].length)
      continue
    }

    const number = remaining.match(/^(?:(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)/i)
    if (number) {
      const value = Number(number[0])
      if (!Number.isFinite(value)) throw new Error('That number is too large to calculate.')
      const significand = number[0].split(/[eE]/)[0]
      if (value === 0 && /[1-9]/.test(significand)) throw new Error('That number is too small to represent.')
      tokens.push({ type: 'number', value })
      remaining = remaining.slice(number[0].length)
      continue
    }

    const identifier = remaining.match(/^[a-z]+/i)
    if (identifier) {
      const name = identifier[0].toLowerCase()
      if (!FUNCTIONS.has(name)) throw new Error(`Unknown function: ${identifier[0]}.`)
      tokens.push({ type: 'function', value: name })
      remaining = remaining.slice(identifier[0].length)
      continue
    }

    const character = remaining[0]
    if ('+-*/^()%'.includes(character)) {
      tokens.push({ type: 'symbol', value: character })
      remaining = remaining.slice(1)
      continue
    }

    throw new Error(`Unsupported character: ${character}.`)
  }

  return tokens
}

function ensureFinite(value) {
  if (!Number.isFinite(value)) throw new Error('Result is outside the supported number range.')
  return value
}

function applyFunction(name, value) {
  if (name === 'sqrt') {
    if (value < 0) throw new Error('Square root requires a number greater than or equal to zero.')
    return ensureFinite(Math.sqrt(value))
  }
  if (name === 'log' || name === 'ln') {
    if (value <= 0) throw new Error('Logarithms require a number greater than zero.')
    return ensureFinite(name === 'log' ? Math.log10(value) : Math.log(value))
  }

  const radians = (value * Math.PI) / 180
  if (name === 'tan' && Math.abs(Math.cos(radians)) < 1e-12) {
    throw new Error('Tangent is undefined at this angle.')
  }
  const result = name === 'sin' ? Math.sin(radians)
    : name === 'cos' ? Math.cos(radians)
      : Math.tan(radians)
  return ensureFinite(result)
}

export function evaluateScientificExpression(source) {
  if (typeof source !== 'string' || source.trim() === '') throw new Error('Enter an expression first.')
  if (source.length > 160) throw new Error('Expression is too long.')

  const tokens = tokenize(source)
  let position = 0
  const peek = () => tokens[position]
  const take = (value) => {
    if (peek()?.value !== value) return false
    position += 1
    return true
  }

  function parseExpression() {
    let value = parseTerm()
    while (peek()?.value === '+' || peek()?.value === '-') {
      const operator = tokens[position++].value
      const right = parseTerm()
      value = ensureFinite(operator === '+' ? value + right : value - right)
    }
    return value
  }

  function parseTerm() {
    let value = parseUnary()
    while (peek()?.value === '*' || peek()?.value === '/') {
      const operator = tokens[position++].value
      const right = parseUnary()
      if (operator === '/' && right === 0) throw new Error('Cannot divide by zero.')
      const result = operator === '*' ? value * right : value / right
      if (result === 0 && value !== 0 && right !== 0) throw new Error('Result is too small to represent.')
      value = ensureFinite(result)
    }
    return value
  }

  function parseUnary() {
    if (take('+')) return parseUnary()
    if (take('-')) return ensureFinite(-parseUnary())
    return parsePower()
  }

  function parsePower() {
    const base = parsePostfix()
    if (!take('^')) return base
    const exponent = parseUnary()
    const result = Math.pow(base, exponent)
    if (Number.isNaN(result)) throw new Error('That power does not have a real-number result.')
    if (base !== 0 && result === 0) throw new Error('Result is too small to represent.')
    return ensureFinite(result)
  }

  function parsePostfix() {
    let value = parsePrimary()
    while (take('%')) value = ensureFinite(value / 100)
    return value
  }

  function parsePrimary() {
    const token = peek()
    if (!token) throw new Error('Expression is incomplete.')

    if (token.type === 'number') {
      position += 1
      return token.value
    }

    if (token.type === 'function') {
      position += 1
      if (!take('(')) throw new Error(`Use parentheses after ${token.value}.`)
      const argument = parseExpression()
      if (!take(')')) throw new Error('Missing closing parenthesis.')
      return applyFunction(token.value, argument)
    }

    if (take('(')) {
      const value = parseExpression()
      if (!take(')')) throw new Error('Missing closing parenthesis.')
      return value
    }

    throw new Error('Expected a number or an opening parenthesis.')
  }

  const result = parseExpression()
  if (position < tokens.length) {
    if (peek()?.value === ')') throw new Error('There is an unmatched closing parenthesis.')
    throw new Error('Check the expression near the end.')
  }
  const formatted = formatCalculatorNumber(result)
  if (formatted === null) throw new Error('Result is outside the supported number range.')
  return formatted
}
