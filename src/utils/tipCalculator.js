const DECIMAL_INPUT = /^-?(?:\d+(?:\.\d*)?|\.\d+)$/
const WHOLE_NUMBER_INPUT = /^\d+$/

function parseDecimal(value) {
  const normalized = value.trim()
  if (!DECIMAL_INPUT.test(normalized)) return null
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

function toCents(amount) {
  const cents = Math.round((amount + Number.EPSILON) * 100)
  return Number.isSafeInteger(cents) ? cents : null
}

export function calculateTip(billInput, tipPercentInput, peopleInput) {
  if (!billInput.trim()) return { error: 'Enter a bill amount.' }
  if (!tipPercentInput.trim()) return { error: 'Enter a tip percentage.' }
  if (!peopleInput.trim()) return { error: 'Enter the number of people.' }

  const bill = parseDecimal(billInput)
  const tipPercent = parseDecimal(tipPercentInput)
  const peopleText = peopleInput.trim()

  if (bill === null) return { error: 'Enter a valid bill amount using digits and a decimal point.' }
  if (bill < 0) return { error: 'Bill amount cannot be negative.' }
  if (tipPercent === null) return { error: 'Enter a valid tip percentage using digits and a decimal point.' }
  if (tipPercent < 0) return { error: 'Tip percentage cannot be negative.' }
  if (!WHOLE_NUMBER_INPUT.test(peopleText)) return { error: 'Number of people must be a whole number of at least 1.' }

  const people = Number(peopleText)
  if (!Number.isSafeInteger(people) || people < 1) {
    return { error: 'Number of people must be a whole number of at least 1.' }
  }

  const billCents = toCents(bill)
  if (billCents === null) return { error: 'Bill amount is too large to calculate.' }

  const rawTipCents = (billCents * tipPercent) / 100
  if (!Number.isFinite(rawTipCents) || rawTipCents > Number.MAX_SAFE_INTEGER) {
    return { error: 'Tip amount is outside the supported calculation range.' }
  }

  const tipCents = Math.round(rawTipCents + Number.EPSILON)
  const totalCents = billCents + tipCents
  if (!Number.isSafeInteger(totalCents)) return { error: 'Total bill is outside the supported calculation range.' }

  return {
    tipAmount: tipCents / 100,
    totalBill: totalCents / 100,
    amountPerPerson: totalCents / 100 / people,
  }
}
