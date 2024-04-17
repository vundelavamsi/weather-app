// components/ForecastWeather.js
import React, { Component } from 'react';
import { format } from "date-fns";
import './index.css';

class ForecastWeather extends Component {
  state = {
    forecastData: null,
    isLoading: true,
    error: null,
    location: '',
    searchQuery: ''
  };

  componentDidMount() {
    this.fetchForecastData();
  }

  fetchForecastData = () => {
    const { searchQuery } = this.state;
    let apiUrl = 'https://api.tomorrow.io/v4/weather/forecast';
    let apiKey = 'qDCtHviqeU0id7wsq6gHEzzbQu2B8Vac';

    if (searchQuery) {
      apiUrl += `?location=${searchQuery}&apikey=${apiKey}`;
    } else {
      this.getUserLocation()
        .then(({ latitude, longitude }) => {
          apiUrl += `?location=${latitude},${longitude}&apikey=${apiKey}`;
          this.fetchData(apiUrl);
        })
        .catch(error => {
          this.setState({
            error: "Failed to get user's location. Please enter a location manually.",
            isLoading: false
          });
        });
    }

    this.fetchData(apiUrl);
  };

  getUserLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        error => {
          reject(error);
        }
      );
    });
  };

  fetchData = apiUrl => {
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch forecast data');
        }
        return response.json();
      })
      .then(data => {
        this.setState({
          forecastData: data,
          isLoading: false,
          error: null
        });
      })
      .catch(error => {
        this.setState({
          error: error.message,
          isLoading: false
        });
      });
  };

  handleInputChange = event => {
    this.setState({
      searchQuery: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ isLoading: true }, () => {
      this.fetchForecastData();
    });
  };

  render() {
    const { forecastData, isLoading, error, searchQuery } = this.state;

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }
    const TimeFormatter = (time) => {
      const formattedTime = format(time, "h:mm:ss a");
      console.log(formattedTime)
      return formattedTime;
    };
    
    const DayFormatter = (time) => {
      const formattedDay = format(time, "MMMM do yyyy");
      console.log(forecastData)
      return formattedDay;
    };

    return (
      <div className="container">
        <h2 className="heading">Forecast Weather</h2>
        <form onSubmit={this.handleSubmit} className="top-bar">
          <input
            type="text"
            placeholder="Enter location"
            value={searchQuery}
            onChange={this.handleInputChange}
          />
          <button type="submit" className="button">Search</button>
        </form>
        {forecastData && (
          <div className='forecast-container'>
            <h3 className='forecast-type'>Hourly Forecast</h3>
            <ul className='ul-list-forecast'>
              {forecastData.timelines.hourly.slice(1,6).map(hourlyData => (
                <li key={hourlyData.time} className='each-hour-forcast'>
                  <p className='details'>{TimeFormatter(hourlyData.time)}</p>
                  <p className='details'>Temp: {Math.floor(hourlyData.values.temperature)}°C</p>
                  <p className='details'>Humidity: {Math.floor(hourlyData.values.humidity)}%</p>
                </li>
              ))}
            </ul>
            <h3 className='forecast-type'>Daily Forecast</h3>
            <ul className='ul-list-forecast'>
              {forecastData.timelines.daily.slice(1,6).map(dailyData => (
                <li key={dailyData.time} className='each-hour-forcast'>
                  <p className='details'>{DayFormatter(dailyData.time)}</p>
                  <p className='details'>Min Temp: {Math.floor(dailyData.values.temperatureMin)}°C</p>
                  <p className='details'>Max Temp: {Math.floor(dailyData.values.temperatureMax)}°C</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default ForecastWeather;
