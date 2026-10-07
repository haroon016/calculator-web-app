import { useEffect, useState } from 'react'
import BasicCalculator from './components/BasicCalculator'
import ScientificCalculator from './components/ScientificCalculator'
import LoanCalculator from './components/LoanCalculator'
import TipCalculator from './components/TipCalculator'
import './App.css'

const calculators = [
  { id: 'basic', label: 'Basic', Component: BasicCalculator },
  { id: 'scientific', label: 'Scientific', Component: ScientificCalculator },
  { id: 'loan', label: 'Loan / Mortgage', Component: LoanCalculator },
  { id: 'tip', label: 'Tip', Component: TipCalculator },
]

function App() {
  const [activeCalculator, setActiveCalculator] = useState('basic')
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    return () => delete document.documentElement.dataset.theme
  }, [theme])

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">Everyday calculations</p>
        <div className="app-header__title-row">
          <h1>Calculator</h1>
          <button
            type="button"
            className="theme-toggle"
            aria-label="Dark mode"
            aria-pressed={theme === 'dark'}
            onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
          >
            <span className="theme-toggle__icon" aria-hidden="true">{theme === 'light' ? '☾' : '☼'}</span>
            Dark mode
          </button>
        </div>
        <p className="intro">Choose a calculator to get started.</p>
      </header>

      <nav className="calculator-nav" aria-label="Calculator type">
        {calculators.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className="calculator-nav__button"
            aria-pressed={activeCalculator === id}
            onClick={() => setActiveCalculator(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      <section className="calculator-panels" aria-label="Calculator">
        {calculators.map(({ id, Component }) => (
          <div key={id} hidden={activeCalculator !== id}>
            <Component />
          </div>
        ))}
      </section>
    </main>
  )
}

export default App
