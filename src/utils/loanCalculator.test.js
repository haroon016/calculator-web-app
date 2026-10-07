import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateLoan } from './loanCalculator.js'

test('calculates a standard fixed-rate monthly payment and totals', () => {
  const result = calculateLoan('200000', '6.5', '30')
  assert.ok(Math.abs(result.monthlyPayment - 1264.136) < 0.01)
  assert.equal(result.paymentCount, 360)
  assert.ok(result.totalPaid > 200000)
  assert.ok(result.totalInterest > 0)
})

test('zero-interest loans divide principal evenly across monthly payments', () => {
  assert.deepEqual(calculateLoan('12000', '0', '10'), {
    monthlyPayment: 100,
    totalPaid: 12000,
    totalInterest: 0,
    paymentCount: 120,
  })
})

test('accepts small loans, cent precision, and decimal annual rates', () => {
  assert.ok(calculateLoan('0.01', '5', '1').monthlyPayment > 0)
  assert.ok(calculateLoan('10000', '3.75', '5').monthlyPayment > 0)
  assert.ok(calculateLoan('1000.000', '0', '1').monthlyPayment > 0)
})

test('rejects sub-cent precision, malformed values, and invalid boundaries', () => {
  assert.match(calculateLoan('0.001', '0', '1').error, /smaller than one cent/i)
  assert.match(calculateLoan('1.001', '5', '1').error, /smaller than one cent/i)
  assert.match(calculateLoan('not money', '5', '1').error, /valid loan amount/i)
  assert.match(calculateLoan('0', '5', '1').error, /greater than zero/i)
  assert.match(calculateLoan('-10', '5', '1').error, /greater than zero/i)
  assert.match(calculateLoan('100', '-1', '1').error, /cannot be negative/i)
  assert.match(calculateLoan('100', '5', '0').error, /greater than zero/i)
  assert.match(calculateLoan('100', '5', '0.1').error, /whole number of monthly payments/i)
})

test('empty fields and outputs outside the finite calculation range are rejected', () => {
  assert.match(calculateLoan('', '5', '1').error, /enter a loan amount/i)
  assert.match(calculateLoan('100', '', '1').error, /enter an annual interest rate/i)
  assert.match(calculateLoan('100', '5', '').error, /enter a loan term/i)
  assert.match(calculateLoan('9'.repeat(308), '100', '30').error, /supported calculation range/i)
})
