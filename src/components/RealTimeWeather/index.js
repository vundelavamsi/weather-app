// components/RealTimeWeather.js
import React, { Component } from "react";

import "./index.css";

import clear_icon from "../Assets/clear.png";
import humidity_icon from '../Assets/humidity.png';
import wind_icon from '../Assets/wind.png';

class RealTimeWeather extends Component {
  state = {
    weatherData: null,
    isLoading: true,
    error: null,
    location: "",
    searchQuery: "",
  };

  componentDidMount() {
    this.fetchWeatherData();
  }

  fetchWeatherData = () => {
    const { searchQuery } = this.state;
    let apiUrl = "https://api.tomorrow.io/v4/weather/realtime";
    let apikey = "qDCtHviqeU0id7wsq6gHEzzbQu2B8Vac";

    if (searchQuery) {
      // If a search query is provided, use it to fetch weather data for that location
      apiUrl += `?location=${searchQuery}&apikey=${apikey}`;
    } else {
      // If no search query is provided, try to detect user's location
      this.getUserLocation()
        .then(({ latitude, longitude }) => {
          apiUrl += `?location=${latitude},${longitude}&apikey=${apikey}`;
          this.fetchData(apiUrl);
        })
        .catch((error) => {
          this.setState({
            error:
              "Failed to get user's location. Please enter a location manually.",
            isLoading: false,
          });
        });
    }

    this.fetchData(apiUrl);
  };

  getUserLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  fetchData = (apiUrl) => {
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          weatherData: data,
          isLoading: false,
          error: null,
        });
      })
      .catch((error) => {
        this.setState({
          error: error.message,
          isLoading: false,
        });
      });
  };

  handleInputChange = (event) => {
    this.setState({
      searchQuery: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ isLoading: true }, () => {
      this.fetchWeatherData();
    });
  };

  render() {
    const { weatherData, isLoading, error, searchQuery } = this.state;

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div className="container">
        <h2 className="heading">Real-Time Weather</h2>
        <form onSubmit={this.handleSubmit} className="top-bar">
          <input
            type="text"
            placeholder="Enter location"
            value={searchQuery}
            onChange={this.handleInputChange}
          />
          <button type="submit" className="button">
            Search
          </button>
        </form>
        <div className="weather-image">
          <img src={clear_icon} alt="clear_icon" />
        </div>
        <div className="weather-temp">
          {weatherData && Math.floor(weatherData.data.values.temperature)}°C
        </div>
        <div className="weather-location">
          {weatherData && weatherData.data.values.location}
        </div>
        <div className="data-container">
          <div className="element">
            <img src={humidity_icon} alt="humidity_icon" className="icon" />
            <div className="data">
              <div className="humidity-percentage">
                {weatherData && Math.floor(weatherData.data.values.humidity)}%
              </div>
              <div className="text">Humidity</div>
            </div>
          </div>
          <div className="element">
            <img src={wind_icon} alt="wind_icon" className="icon" />
            <div className="data">
              <div className="humidity-percentage">
                {weatherData && Math.floor(weatherData.data.values.windSpeed)}km/h
              </div>
              <div className="text">Wind Speed</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RealTimeWeather;
