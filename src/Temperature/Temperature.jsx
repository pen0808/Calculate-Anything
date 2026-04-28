import { useState } from 'react'
import './temperature.css'

function TemperatureConverter() {
  const [inputTemp, setInputTemp] = useState(0)
  const [fromUnit, setFromUnit] = useState('celsius')
  const [toUnit, setToUnit] = useState('fahrenheit')
  const [result, setResult] = useState(null)
  const [formula, setFormula] = useState('')
  const [steps, setSteps] = useState([])

  const units = [
    { value: 'celsius', label: 'Celsius (°C)', symbol: '°C' },
    { value: 'fahrenheit', label: 'Fahrenheit (°F)', symbol: '°F' },
    { value: 'kelvin', label: 'Kelvin (K)', symbol: 'K' }
  ]

  const convertTemperature = () => {
    const temp = parseFloat(inputTemp)
    if (isNaN(temp)) {
      setResult(null)
      return
    }

    let convertedTemp
    let conversionFormula
    let solutionSteps = []

    // Convert to Celsius first (as intermediate step)
    let tempInCelsius
    switch (fromUnit) {
      case 'celsius':
        tempInCelsius = temp
        break
      case 'fahrenheit':
        tempInCelsius = (temp - 32) * 5 / 9
        break
      case 'kelvin':
        tempInCelsius = temp - 273.15
        break
    }

    // Convert from Celsius to target unit
    switch (toUnit) {
      case 'celsius':
        convertedTemp = tempInCelsius
        if (fromUnit === 'fahrenheit') {
          conversionFormula = `°C = (°F - 32) × 5/9`
          solutionSteps = [
            `Step 1: °C = (${temp} - 32) × 5/9`,
            `Step 2: °C = ${temp - 32} × 5/9`,
            `Step 3: °C = ${(temp - 32) * 5}/9`,
            `Step 4: °C = ${convertedTemp.toFixed(2)}`
          ]
        } else if (fromUnit === 'kelvin') {
          conversionFormula = `°C = K - 273.15`
          solutionSteps = [
            `Step 1: °C = ${temp} - 273.15`,
            `Step 2: °C = ${convertedTemp.toFixed(2)}`
          ]
        } else {
          conversionFormula = `°C = °C`
          solutionSteps = [`No conversion needed`]
        }
        break

      case 'fahrenheit':
        convertedTemp = tempInCelsius * 9 / 5 + 32
        if (fromUnit === 'celsius') {
          conversionFormula = `°F = (°C × 9/5) + 32`
          solutionSteps = [
            `Step 1: °F = (${temp} × 9/5) + 32`,
            `Step 2: °F = ${temp * 9 / 5} + 32`,
            `Step 3: °F = ${convertedTemp.toFixed(2)}`
          ]
        } else if (fromUnit === 'kelvin') {
          conversionFormula = `°F = ((K - 273.15) × 9/5) + 32`
          solutionSteps = [
            `Step 1: Convert K to °C: °C = ${temp} - 273.15 = ${tempInCelsius.toFixed(2)}`,
            `Step 2: °F = (${tempInCelsius.toFixed(2)} × 9/5) + 32`,
            `Step 3: °F = ${(tempInCelsius * 9 / 5).toFixed(2)} + 32`,
            `Step 4: °F = ${convertedTemp.toFixed(2)}`
          ]
        } else {
          conversionFormula = `°F = °F`
          solutionSteps = [`No conversion needed`]
        }
        break

      case 'kelvin':
        convertedTemp = tempInCelsius + 273.15
        if (fromUnit === 'celsius') {
          conversionFormula = `K = °C + 273.15`
          solutionSteps = [
            `Step 1: K = ${temp} + 273.15`,
            `Step 2: K = ${convertedTemp.toFixed(2)}`
          ]
        } else if (fromUnit === 'fahrenheit') {
          conversionFormula = `K = ((°F - 32) × 5/9) + 273.15`
          solutionSteps = [
            `Step 1: Convert °F to °C: °C = (${temp} - 32) × 5/9 = ${tempInCelsius.toFixed(2)}`,
            `Step 2: K = ${tempInCelsius.toFixed(2)} + 273.15`,
            `Step 3: K = ${convertedTemp.toFixed(2)}`
          ]
        } else {
          conversionFormula = `K = K`
          solutionSteps = [`No conversion needed`]
        }
        break
    }

    setResult(convertedTemp)
    setFormula(conversionFormula)
    setSteps(solutionSteps)
  }

  const handleSwap = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    setResult(null)
    setSteps([])
  }

  const getSymbol = (unit) => units.find(u => u.value === unit)?.symbol || ''

  return (
    <div className="temperature-container">
      <h2>Temperature Converter</h2>
      <div className="converter-form">
        <div className="form-group">
          <label>Temperature</label>
          <input
            type="number"
            value={inputTemp}
            onChange={(e) => {
              setInputTemp(e.target.value)
              setResult(null)
              setSteps([])
            }}
            step="0.1"
          />
        </div>

        <div className="form-group">
          <label>From</label>
          <select value={fromUnit} onChange={(e) => {
            setFromUnit(e.target.value)
            setResult(null)
            setSteps([])
          }}>
            {units.map(unit => (
              <option key={unit.value} value={unit.value}>{unit.label}</option>
            ))}
          </select>
        </div>

        <button className="swap-btn" onClick={handleSwap}>↔ Swap</button>

        <div className="form-group">
          <label>To</label>
          <select value={toUnit} onChange={(e) => {
            setToUnit(e.target.value)
            setResult(null)
            setSteps([])
          }}>
            {units.map(unit => (
              <option key={unit.value} value={unit.value}>{unit.label}</option>
            ))}
          </select>
        </div>

        <button className="convert-btn" onClick={convertTemperature}>
          Convert
        </button>

        {result !== null && (
          <div className="result-section">
            <div className="result">
              <h3>{inputTemp} {getSymbol(fromUnit)} = {result.toFixed(2)} {getSymbol(toUnit)}</h3>
            </div>

            <div className="solution">
              <h4>Solution:</h4>
              <div className="formula">
                <strong>Formula:</strong> {formula}
              </div>
              <div className="steps">
                {steps.map((step, index) => (
                  <div key={index} className="step">{step}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TemperatureConverter
