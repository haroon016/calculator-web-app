import assert from 'node:assert/strict'
import test from 'node:test'
import { evaluateScientificExpression } from './scientificExpression.js'

test('scientific arithmetic respects precedence and parentheses', () => {
  assert.equal(evaluateScientificExpression('2+3×4'), '14')
  assert.equal(evaluateScientificExpression('(2+3)×4'), '20')
  assert.equal(evaluateScientificExpression('2^3^2'), '512')
})

test('scientific functions calculate square root, square, powers, and percent', () => {
  assert.equal(evaluateScientificExpression('sqrt(9)'), '3')
  assert.equal(evaluateScientificExpression('5^2'), '25')
  assert.equal(evaluateScientificExpression('2^3'), '8')
  assert.equal(evaluateScientificExpression('25%'), '0.25')
})

test('trigonometric functions use degrees and logarithms use the documented bases', () => {
  assert.equal(evaluateScientificExpression('sin(30)'), '0.5')
  assert.equal(evaluateScientificExpression('cos(60)'), '0.5')
  assert.equal(evaluateScientificExpression('tan(45)'), '1')
  assert.equal(evaluateScientificExpression('log(100)'), '2')
  assert.equal(evaluateScientificExpression('ln(1)'), '0')
})

test('invalid domains and division by zero return clear errors', () => {
  assert.throws(() => evaluateScientificExpression('sqrt(-1)'), /greater than or equal to zero/i)
  assert.throws(() => evaluateScientificExpression('log(0)'), /greater than zero/i)
  assert.throws(() => evaluateScientificExpression('ln(-2)'), /greater than zero/i)
  assert.throws(() => evaluateScientificExpression('1/0'), /divide by zero/i)
  assert.throws(() => evaluateScientificExpression('tan(90)'), /undefined at this angle/i)
  assert.throws(() => evaluateScientificExpression('(-2)^0.5'), /real-number result/i)
})

test('malformed expressions and unsupported characters are rejected', () => {
  assert.throws(() => evaluateScientificExpression('(1+2'), /closing parenthesis/i)
  assert.throws(() => evaluateScientificExpression('1+'), /incomplete/i)
  assert.throws(() => evaluateScientificExpression('2@3'), /unsupported character/i)
  assert.throws(() => evaluateScientificExpression('unknown(2)'), /unknown function/i)
})

test('very large finite values remain representable and overflow or underflow is reported', () => {
  assert.ok(Number.isFinite(Number(evaluateScientificExpression('1e308'))))
  assert.throws(() => evaluateScientificExpression('1e309'), /too large/i)
  assert.throws(() => evaluateScientificExpression('1e-999'), /too small/i)
  assert.throws(() => evaluateScientificExpression('1e-300*1e-300'), /too small/i)
  assert.throws(() => evaluateScientificExpression('1e-300^2'), /too small/i)
  assert.throws(() => evaluateScientificExpression('9^9999'), /supported number range/i)
})
