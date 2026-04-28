import { useState } from "react"
import './bmi.css'

function Bmi(){
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [bmiValue, setBmiValue] = useState(null)
  const [bmiCategory, setBmiCategory] = useState("")

  function handleWeight(e){
    setWeight(e.target.value)
    setBmiValue(null)
    setBmiCategory("")
  }

  function handleHeight(e){
    setHeight(e.target.value)
    setBmiValue(null)
    setBmiCategory("")
  }

  function calbmi(){
    const w = parseFloat(weight)
    const h = parseFloat(height)

    if(!w || !h || w <= 0 || h <= 0){
      setBmiValue(null)
      setBmiCategory("Please enter valid weight and height")
      return
    }

    const heightm = h/100
    const bmiresult = (w/(heightm * heightm)).toFixed(1)

    let outcome = ""

    if(bmiresult < 18.5){
      outcome = "You are underweight"
    }else if(bmiresult < 25){
      outcome = "You are healthy"
    }else if(bmiresult < 30){
      outcome = "You are overweight"
    }else if(bmiresult < 35){
      outcome = "You are obese (Class 1)"
    }else if(bmiresult < 40){
      outcome = "You are obese (Class 2)"
    }else if(bmiresult >= 40){
      outcome = "You are obese (Class 3)"
    }

    setBmiValue(bmiresult)
    setBmiCategory(outcome)
  }

  function reset(){
    setWeight("")
    setHeight("")
    setBmiValue(null)
    setBmiCategory("")
  }

  return(
    <div className="outercontainer">
      <div className="bmicontainer">
        <h1>Calculate your BMI</h1>
        <div className="inputgrp">
          <div className="weight">
            <input type="number" placeholder="Weight (kg)" onChange={handleWeight} value={weight} />
          </div>
          <div className="height">
            <input type="number" placeholder="Height (cm)" onChange={handleHeight} value={height} />
          </div>
        </div>
        <div className="btngrp">
          <button className="calbtn" onClick={calbmi}>Calculate your BMI</button>
          <button className="resetbtn" onClick={reset}>Reset</button>
        </div>

        {bmiValue && (
          <div className="result">
            <p>Your BMI Result: {bmiValue}</p>
            <p>{bmiCategory}</p>
          </div>
        )}

        {bmiCategory && !bmiValue && (
          <div className="result error">
            <p>{bmiCategory}</p>
          </div>
        )}
      </div>

      <div className="bmiInfo">
        <h2>BMI Categories (Adult)</h2>
        <div className="infocontainer">
          <div className="bmiTitle">
            <div>
              <h3>BMI Category</h3>
            </div>
            <div>
              <h3>BMI Range (kg/m<sup>2</sup>)</h3>
            </div>
          </div>
          <div className="row">
            <div>
              <p>Underweight</p>
            </div>
            <div>
              <p>Below 18.5</p>
            </div>
          </div>
          <div className="row">
            <div>
              <p>Healthy weight</p>
            </div>
            <div>
              <p> 18.5 to below 25</p>
            </div>
          </div>
          <div className="row">
            <div>
              <p>Over-weight</p>
            </div>
            <div>
              <p>25 to below 30</p>
            </div>
          </div>
          <div className="row">
            <div>
              <p>Class 1 Obesity</p>
            </div>
            <div>
              <p>30 to below 35</p>
            </div>
          </div>
          <div className="row">
            <div>
              <p>Class 2 Obesity</p>
            </div>
            <div>
              <p>35 to below 40</p>
            </div>
          </div>
          <div className="row">
            <div>
              <p>Class 3 Obesity</p>
            </div>
            <div>
              <p>40 and above</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Bmi
