import { useState, useEffect } from 'react'
import './currency.css'

// Try multiple free APIs for reliability
const API_ENDPOINTS = [
  {
    name: 'Frankfurter',
    url: 'https://api.frankfurter.app/latest',
    convert: (data, amount, from, to) => data.rates?.[to]
  },
  {
    name: 'ExchangeRate-API',
    url: 'https://open.er-api.com/v6/latest',
    convert: (data, amount, from, to) => {
      const rate = data.rates?.[to]
      return rate ? amount * rate : null
    }
  }
]

// Static fallback rates (guaranteed to work)
const STATIC_RATES = {
  'USD': { 'EUR': 0.92, 'GBP': 0.79, 'JPY': 149.50, 'INR': 83.10 },
  'EUR': { 'USD': 1.09, 'GBP': 0.86, 'JPY': 162.50, 'INR': 90.50 },
  'GBP': { 'USD': 1.27, 'EUR': 1.16, 'JPY': 189.20, 'INR': 105.30 },
  'JPY': { 'USD': 0.0067, 'EUR': 0.0062, 'GBP': 0.0053, 'INR': 0.56 },
  'INR': { 'USD': 0.012, 'EUR': 0.011, 'GBP': 0.0095, 'JPY': 1.79 }
}

const POPULAR_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'AUD', 'CAD', 'CHF', 'CNY', 'SGD']

function CurrencyConverter() {
  const [amount, setAmount] = useState(1)
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [convertedAmount, setConvertedAmount] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')
  const [apiName, setApiName] = useState('')
  const [usingStatic, setUsingStatic] = useState(false)

  const convertCurrency = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    setLoading(true)
    setError('')

    // Try each API
    for (const api of API_ENDPOINTS) {
      try {
        const url = api.name === 'Frankfurter'
          ? `${api.url}?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
          : `${api.url}/${fromCurrency}`

        const response = await fetch(url, {
          headers: { 'Accept': 'application/json' }
        })

        if (!response.ok) continue

        const data = await response.json()
        const result = api.convert(data, amount, fromCurrency, toCurrency)

        if (result !== null && result !== undefined) {
          setConvertedAmount(result)
          setLastUpdated(new Date().toLocaleTimeString())
          setApiName(api.name)
          setUsingStatic(false)
          setLoading(false)
          return
        }
      } catch (err) {
        console.warn(`${api.name} failed:`, err.message)
      }
    }

    // All APIs failed - use static rates
    try {
      if (STATIC_RATES[fromCurrency]?.[toCurrency]) {
        const rate = STATIC_RATES[fromCurrency][toCurrency]
        const result = amount * rate
        setConvertedAmount(result)
        setLastUpdated(new Date().toLocaleTimeString())
        setApiName('Static Data')
        setUsingStatic(true)
        setError('Using static rates (not real-time)')
        setTimeout(() => setError(''), 5000)
      } else {
        throw new Error('Currency pair not in static database')
      }
    } catch (err) {
      setError(`Unable to convert: ${err.message}`)
      setConvertedAmount(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (fromCurrency && toCurrency && amount > 0) {
        convertCurrency()
      }
    }, 600)
    return () => clearTimeout(debounce)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, fromCurrency, toCurrency])

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  return (
    <div className="currency-container">
      <h2>Currency Converter</h2>
      <div className="api-source">
        {usingStatic ? (
          <span className="static-badge">Static Rates</span>
        ) : (
          <span className="live-badge">Live: {apiName}</span>
        )}
      </div>
      {error && <div className="error">{error}</div>}
      <div className="converter-form">
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>From</label>
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            {POPULAR_CURRENCIES.map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>
        <button className="swap-btn" onClick={handleSwap}>↔ Swap</button>
        <div className="form-group">
          <label>To</label>
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            {POPULAR_CURRENCIES.map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>
        {loading ? (
          <div className="loading">Converting...</div>
        ) : convertedAmount !== null ? (
          <div className="result">
            <h3>{amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}</h3>
            <p>Rate: 1 {fromCurrency} = {(convertedAmount / amount).toFixed(4)} {toCurrency}</p>
            {lastUpdated && <p className="updated">Updated: {lastUpdated}</p>}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default CurrencyConverter

