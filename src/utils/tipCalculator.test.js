import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateTip } from './tipCalculator.js'

test('calculates a standard tip, total, and even split', () => {
  const result = calculateTip('84.50', '18', '3')
  assert.equal(result.tipAmount, 15.21)
  assert.equal(result.totalBill, 99.71)
  assert.ok(Math.abs(result.amountPerPerson - 99.71 / 3) < 1e-12)
})

test('supports custom percentages and one or multiple people', () => {
  assert.deepEqual(calculateTip('100', '12.5', '1'), {
    tipAmount: 12.5,
    totalBill: 112.5,
    amountPerPerson: 112.5,
  })
  assert.equal(calculateTip('60', '10', '3').amountPerPerson, 22)
})

test('rounds decimal bills and tips to cents and accepts a zero bill', () => {
  const rounded = calculateTip('1.005', '10', '2')
  assert.equal(rounded.tipAmount, 0.1)
  assert.equal(rounded.totalBill, 1.11)
  assert.equal(calculateTip('0', '15', '1').totalBill, 0)
})

test('rejects empty, malformed, negative, or out-of-range inputs', () => {
  assert.match(calculateTip('', '15', '1').error, /enter a bill amount/i)
  assert.match(calculateTip('abc', '15', '1').error, /valid bill amount/i)
  assert.match(calculateTip('-1', '15', '1').error, /cannot be negative/i)
  assert.match(calculateTip('20', '-1', '1').error, /tip percentage cannot be negative/i)
  assert.match(calculateTip('20', '15', '0').error, /at least 1/i)
  assert.match(calculateTip('20', '15', '2.5').error, /whole number/i)
  assert.match(calculateTip('20', '15', '9007199254740992').error, /whole number/i)
  assert.match(calculateTip('20', 'not a rate', '1').error, /valid tip percentage/i)
})
