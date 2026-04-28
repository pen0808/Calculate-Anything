import { useState } from 'react'
import './percentage.css'

function formatWithCommas(value) {
    const num = value.replace(/,/g, '')
    if (num === '' || isNaN(num)) return value
    return parseFloat(num).toLocaleString('en-US')
}

function Percentage(){
    const [percent, setPercent] = useState("")
    const [number, setNumber] = useState("")
    const [result, setResult] = useState("")
    const [error, setError] = useState("")

    function handlePercent(e){
        const formatted = formatWithCommas(e.target.value)
        setPercent(formatted)
        setError("")
        setResult("")
    }

    function handleNumber(e){
        const formatted = formatWithCommas(e.target.value)
        setNumber(formatted)
        setError("")
        setResult("")
    }

    function calculate(){
        const p = parseFloat(percent.replace(/,/g, ''))
        const n = parseFloat(number.replace(/,/g, ''))

        if(!isNaN(p) && !isNaN(n) && p >= 0 && n >= 0){
            const calculated = (p / 100) * n
            setResult(calculated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
            setError("")
        } else {
            setError("Please enter valid positive numbers")
            setResult("")
        }
    }

    function reset(){
        setPercent("")
        setNumber("")
        setResult("")
        setError("")
    }

    return(
        <div className="container">
            <div className="inner-container">
                <h1 className='title'>Percentage Calculator</h1>
                <div className="inputgrp">
                    <div className="inputs">
                        <div className='percent input2'>
                            <label>Percentage</label>
                            <input type="text" inputMode="numeric" value={percent} onChange={handlePercent} placeholder="Enter percentage" />
                            <span>%</span>
                        </div>
                        <div className='input2'>
                            <label>Number</label>
                            <input type="text" inputMode="numeric" value={number} onChange={handleNumber} placeholder="Enter number" />
                        </div>

                        <div className="btn-group">
                            <button onClick={calculate}>Calculate</button>
                            <button onClick={reset}>Reset</button>
                        </div>

                    </div>
                    <div className="answer">
                        <p>Result:</p>
                        <p>{result || "0"}</p>
                    </div>
                </div>
                {error && <p className="error-msg">{error}</p>}
            </div>
        </div>
    )
}

export default Percentage
