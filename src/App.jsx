import {HashRouter, Routes, Route, Link} from "react-router-dom"
import Bmi from "./BMI/BMI.jsx"
import Calculator from "./Calculator/Calculator.jsx"
import Percentage from "./Percentage/percentage.jsx"
import CurrencyConverter from "./Currency/Currency.jsx"
import TemperatureConverter from "./Temperature/Temperature.jsx"

function App() {
  
  return (
    <HashRouter>
      <nav>
        <Link to="/">Bmi</Link>
        <Link to="/calculator">Simple Calculator</Link>
        <Link to="/percentage">Percentage</Link>
        <Link to="/currency">Currency Converter</Link>
        <Link to="/temperature">Temperature Converter</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Bmi />}/>
        <Route path="/calculator" element={<Calculator />}/>
        <Route path="/percentage" element={<Percentage />}/>
        <Route path="/currency" element={<CurrencyConverter />}/>
        <Route path="/temperature" element={<TemperatureConverter />}/>
      </Routes>
         
    </HashRouter>
  )
}

export default App
