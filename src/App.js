// App.js
import React from "react";
import "./App.css";
import RealTimeWeather from "./components/RealTimeWeather";
import ForecastWeather from './components/ForecastWeather';

function App() {
  return (
    <div className="App">
      <RealTimeWeather />
      <ForecastWeather />
    </div>
  );
}

export default App;
