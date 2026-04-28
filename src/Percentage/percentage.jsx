import { useState } from 'react'
import './percentage.css'

function formatWithCommas(value) {
    const num = value.replace(/,/g, '');
    if (num === '' || isNaN(num)) return value;
    return parseFloat(num).toLocaleString('en-US');
}

function Percentage(){
    const [percent, setPercent] = useState("");
    const [number, setNumber] = useState("");
    const [result, setResult] = useState("");

    function handlePercent(e){
        const formatted = formatWithCommas(e.target.value);
        setPercent(formatted);
    }

    function handleNumber(e){
        const formatted = formatWithCommas(e.target.value);
        setNumber(formatted);
    }

    function calculate(){
        const p = parseFloat(percent.replace(/,/g, ''));
        const n = parseFloat(number.replace(/,/g, ''));
        
        if(!isNaN(p) && !isNaN(n)){
            const calculated = (p / 100) * n;
        setResult(calculated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        } else {
            setResult("Please enter valid numbers");
        }
    }

    function reset(){
        setPercent("");
        setNumber("");
        setResult("");
    }

    return(
        <div className="container">
            <div className="inner-container">
                <h1 className='title'>Percentage Calculator</h1>
                <div className="inputgrp">
                    <div className="inputs">
                        <div className='percent input2'>
                             <input type="text" inputMode="numeric" value={percent} onChange={handlePercent}/> 
                             <span>%</span>
                         </div>
                         <div className='input2'>
                             <input type="text" inputMode="numeric" value={number} onChange={handleNumber}/> 
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
            </div>
            
            
        </div>
    )
}

export default Percentage

