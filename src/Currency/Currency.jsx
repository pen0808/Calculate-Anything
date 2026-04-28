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

// Static fallback rates (guaranteed to work) - using correct ISO 4217 codes
// Fixed: Added missing commas between properties
const STATIC_RATES = {
  'USD': { 'EUR': 0.92, 'GBP': 0.79, 'JPY': 149.50, 'INR': 83.10, 'NGN': 1500, 'ZAR': 18.85, 'AUD': 1.53, 'CAD': 1.36, 'CHF': 0.88, 'CNY': 7.24, 'SGD': 1.34 },
  'EUR': { 'USD': 1.09, 'GBP': 0.86, 'JPY': 162.50, 'INR': 90.50, 'NGN': 1600, 'ZAR': 19.85, 'AUD': 1.66, 'CAD': 1.47, 'CHF': 0.95, 'CNY': 7.84, 'SGD': 1.45 },
  'GBP': { 'USD': 1.27, 'EUR': 1.16, 'JPY': 189.20, 'INR': 105.30, 'NGN': 1700, 'ZAR': 23.50, 'AUD': 1.94, 'CAD': 1.71, 'CHF': 1.11, 'CNY': 9.15, 'SGD': 1.69 },
  'JPY': { 'USD': 0.0067, 'EUR': 0.0062, 'GBP': 0.0053, 'INR': 0.56, 'NGN': 11, 'ZAR': 0.13, 'AUD': 0.010, 'CAD': 0.0091, 'CHF': 0.0059, 'CNY': 0.048, 'SGD': 0.0089 },
  'INR': { 'USD': 0.012, 'EUR': 0.011, 'GBP': 0.0095, 'JPY': 1.79, 'NGN': 18, 'ZAR': 0.23, 'AUD': 0.018, 'CAD': 0.016, 'CHF': 0.011, 'CNY': 0.087, 'SGD': 0.016 },
  'NGN': { 'USD': 0.00067, 'EUR': 0.00062, 'GBP': 0.00059, 'JPY': 0.089, 'INR': 0.056, 'ZAR': 0.013, 'AUD': 0.0010, 'CAD': 0.00091, 'CHF': 0.00059, 'CNY': 0.0048, 'SGD': 0.00089 },
  'ZAR': { 'USD': 0.053, 'EUR': 0.050, 'GBP': 0.043, 'JPY': 7.92, 'INR': 4.41, 'NGN': 79.5, 'AUD': 0.081, 'CAD': 0.072, 'CHF': 0.047, 'CNY': 0.38, 'SGD': 0.071 },
  'AUD': { 'USD': 0.65, 'EUR': 0.60, 'GBP': 0.52, 'JPY': 97.5, 'INR': 54.3, 'NGN': 980, 'ZAR': 12.3, 'CAD': 0.89, 'CHF': 0.58, 'CNY': 4.73, 'SGD': 0.87 },
  'CAD': { 'USD': 0.74, 'EUR': 0.68, 'GBP': 0.58, 'JPY': 110, 'INR': 61.2, 'NGN': 1100, 'ZAR': 13.9, 'AUD': 1.12, 'CHF': 0.65, 'CNY': 5.32, 'SGD': 0.98 },
  'CHF': { 'USD': 1.14, 'EUR': 1.05, 'GBP': 0.90, 'JPY': 170, 'INR': 94.5, 'NGN': 1700, 'ZAR': 21.4, 'AUD': 1.72, 'CAD': 1.54, 'CNY': 8.21, 'SGD': 1.52 },
  'CNY': { 'USD': 0.14, 'EUR': 0.13, 'GBP': 0.11, 'JPY': 20.6, 'INR': 11.5, 'NGN': 207, 'ZAR': 2.6, 'AUD': 0.21, 'CAD': 0.19, 'CHF': 0.12, 'SGD': 0.19 },
  'SGD': { 'USD': 0.74, 'EUR': 0.69, 'GBP': 0.59, 'JPY': 112, 'INR': 62.3, 'NGN': 1120, 'ZAR': 14.1, 'AUD': 1.13, 'CAD': 1.02, 'CHF': 0.66, 'CNY': 5.41 }
}

// Correct ISO 4217 currency codes (removed invalid YEN and CFA)
const POPULAR_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'NGN', 'ZAR', 'AUD', 'CAD', 'CHF', 'CNY', 'SGD']

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
