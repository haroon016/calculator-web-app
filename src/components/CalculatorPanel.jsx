import { useId } from 'react'

export default function CalculatorPanel({ title, description, children }) {
  const titleId = useId()

  return (
    <section className="calculator-panel" aria-labelledby={titleId}>
      <header className="calculator-panel__header">
        <h2 id={titleId}>{title}</h2>
        <p>{description}</p>
      </header>
      <div className="calculator-panel__content">{children}</div>
    </section>
  )
}

export function PlaceholderMessage({ children }) {
  return <p className="placeholder-message">{children}</p>
}
