import React from 'react'
import './Credits.css'
import { dummyPlans } from '../assets/assets'

const Credits = () => {
  return (
    <div className="credits-page">
      <header className="credits-header">
        <h2>Plans & Credits</h2>
        <p className="muted">Choose a plan that fits your needs. Prices are in USD (dummy data).</p>
      </header>

      <section className="plans-grid">
        {dummyPlans.map((plan) => (
          <article key={plan._id} className="plan-card">
            <div className="plan-header">
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">${plan.price}</div>
            </div>

            <div className="plan-credits">Credits: <strong>{plan.credits}</strong></div>

            <ul className="plan-features">
              {plan.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>

            <div className="plan-actions">
              <button className="btn-primary">Buy {plan.name}</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}

export default Credits
