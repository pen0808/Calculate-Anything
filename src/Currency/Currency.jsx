import { useState, useEffect } from 'react'
import './currency.css'

function CurrencyConverter() {
  const [amount, setAmount] = useState(1)
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [convertedAmount, setConvertedAmount] = useState(null)
  const [currencies, setCurrencies] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch('https://api.frankfurter.app/currencies')
        if (!response.ok) throw new Error('Failed to fetch currencies')
        const data = await response.json()
        setCurrencies(data)
      } catch (err) {
        setError('Failed to load currencies. Please try again later.')
        console.error(err)
      }
    }
    fetchCurrencies()
  }, [])

  useEffect(() => {
    const convertCurrency = async () => {
      if (!amount || isNaN(amount) || amount <= 0) {
        setError('Please enter a valid amount')
        return
      }
      setLoading(true)
      setError('')
      try {
        const response = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
        )
        if (!response.ok) throw new Error('Conversion failed')
        const data = await response.json()
        const result = data.rates[toCurrency]
        setConvertedAmount(result)
      } catch (err) {
        setError('Failed to convert currency. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    convertCurrency()
  }, [amount, fromCurrency, toCurrency])

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  return (
    <div className="currency-container">
      <h2>Currency Converter</h2>
      {error && <div className="error">{error}</div>}
      <div className="converter-form">
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>From</label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {Object.entries(currencies).map(([code, name]) => (
              <option key={code} value={code}>
                {code} - {name}
              </option>
            ))}
          </select>
        </div>
        <button className="swap-btn" onClick={handleSwap}>
          ↔ Swap
        </button>
        <div className="form-group">
          <label>To</label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {Object.entries(currencies).map(([code, name]) => (
              <option key={code} value={code}>
                {code} - {name}
              </option>
            ))}
          </select>
        </div>
        {loading ? (
          <div className="loading">Converting...</div>
        ) : convertedAmount !== null ? (
          <div className="result">
            <h3>
              {amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
            </h3>
            <p>Exchange Rate: 1 {fromCurrency} = {(convertedAmount / amount).toFixed(4)} {toCurrency}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default CurrencyConverter
