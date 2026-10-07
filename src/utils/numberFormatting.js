export function formatCalculatorNumber(value) {
  if (!Number.isFinite(value)) return null
  return String(Number(value.toPrecision(15)))
}
