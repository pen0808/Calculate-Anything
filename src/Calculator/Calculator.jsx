import { useState } from 'react'
import * as math from 'mathjs'
import './calculator.css'

function Calculator(){
  const [input, setInput] = useState("");

  function handleInput(value){
    setInput(input + value)
  }

  function handleClear(){
    setInput("");
  }

  function handleDelete(value){
    setInput(value.slice(0,-1));
  }

  function handleEval(){
  
       try {
      // math.evaluate parses and computes the string safely
      const result = math.evaluate(input);
      setInput(math.format(result, { precision: 10 }).toString());
    } catch (error) {
      setInput("Error");
    }
    
    
  }

  return(
    <div className="outerContainer">
    <div className="mainContainer">
      <div className="inputContainer">
        <div className="input">{input}</div>
      </div>
      <div className="btnContainer">
        <button onClick={handleClear}>C</button>
        <button onClick={()=>handleDelete(input)}>Del</button>
        <button onClick={()=>handleInput('%')}>%</button>
        <button onClick={()=>handleInput('/')}>/</button>
        <button onClick={()=>handleInput('7')}>7</button>
        <button onClick={()=>handleInput('8')}>8</button>
        <button onClick={()=>handleInput('9')}>9</button>
        <button onClick={()=>handleInput('*')}>x</button>
        <button onClick={()=>handleInput('4')}>4</button>
        <button onClick={()=>handleInput('5')}>5</button>
        <button onClick={()=>handleInput('6')}>6</button>
        <button onClick={()=>handleInput('-')}>-</button>
        <button onClick={()=>handleInput('1')}>1</button>
        <button onClick={()=>handleInput('2')}>2</button>
        <button onClick={()=>handleInput('3')}>3</button>
        <button onClick={()=>handleInput('+')}>+</button>
        <button onClick={()=>handleInput('0')}>0</button>
        <button onClick={()=>handleInput('.')}>.</button>
        <button onClick={handleEval}>=</button>
      </div>
    </div>
    </div>
  )
}

export default Calculator