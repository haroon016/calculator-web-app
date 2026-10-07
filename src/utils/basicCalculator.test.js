import assert from 'node:assert/strict'
import test from 'node:test'
import { basicCalculatorReducer, initialCalculatorState } from './basicCalculator.js'

function press(...actions) {
  return actions.reduce(basicCalculatorReducer, initialCalculatorState)
}

function digits(value) {
  return [...value].map((digit) => ({ type: 'digit', value: digit }))
}

test('basic calculator performs the four arithmetic operations', async (t) => {
  const cases = [
    ['addition', '12', '+', '3', '15'],
    ['subtraction', '12', '−', '3', '9'],
    ['multiplication', '12', '×', '3', '36'],
    ['division', '12', '÷', '3', '4'],
  ]

  for (const [name, left, operator, right, expected] of cases) {
    await t.test(name, () => {
      const result = press(...digits(left), { type: 'operator', value: operator }, ...digits(right), { type: 'equals' })
      assert.equal(result.entry, expected)
      assert.equal(result.error, '')
    })
  }
})

test('basic calculator handles decimals without common floating-point artifacts', () => {
  const result = press(
    { type: 'digit', value: '0' }, { type: 'decimal' }, { type: 'digit', value: '1' },
    { type: 'operator', value: '+' },
    { type: 'digit', value: '0' }, { type: 'decimal' }, { type: 'digit', value: '2' },
    { type: 'equals' },
  )
  assert.equal(result.entry, '0.3')
})

test('percentage converts the current value to a fraction and sign toggles it', () => {
  const result = press(...digits('25'), { type: 'percent' }, { type: 'sign' })
  assert.equal(result.entry, '-0.25')
})

test('a repeated operator replaces the pending operator and operations are sequential', () => {
  const replaced = press(...digits('8'), { type: 'operator', value: '+' }, { type: 'operator', value: '×' }, ...digits('2'), { type: 'equals' })
  assert.equal(replaced.entry, '16')

  const sequential = press(...digits('2'), { type: 'operator', value: '+' }, ...digits('3'), { type: 'operator', value: '×' }, ...digits('4'), { type: 'equals' })
  assert.equal(sequential.entry, '20')
})

test('division by zero reports an error and a new digit recovers', () => {
  const failed = press(...digits('8'), { type: 'operator', value: '÷' }, { type: 'digit', value: '0' }, { type: 'equals' })
  assert.match(failed.error, /divide by zero/i)
  const recovered = basicCalculatorReducer(failed, { type: 'digit', value: '7' })
  assert.equal(recovered.entry, '7')
  assert.equal(recovered.error, '')
})

test('clear and backspace reset or delete the current entry', () => {
  assert.equal(press(...digits('123'), { type: 'backspace' }).entry, '12')
  assert.deepEqual(press(...digits('12'), { type: 'clear' }), initialCalculatorState)
})

test('a digit after a result starts fresh, while an operator continues from the result', () => {
  const completed = press(...digits('2'), { type: 'operator', value: '+' }, ...digits('3'), { type: 'equals' })
  assert.equal(basicCalculatorReducer(completed, { type: 'digit', value: '4' }).entry, '4')
  assert.equal(basicCalculatorReducer(completed, { type: 'decimal' }).entry, '0.')

  const continued = press(...digits('2'), { type: 'operator', value: '+' }, ...digits('3'), { type: 'equals' }, { type: 'operator', value: '×' }, ...digits('4'), { type: 'equals' })
  assert.equal(continued.entry, '20')
})

test('malformed direct input is rejected without corrupting state', () => {
  const state = press(...digits('5'))
  assert.equal(basicCalculatorReducer(state, { type: 'input', value: '5x' }), state)
})
