import React, { useState } from 'react';
import axios from 'axios';
import CsvComponent from './csv'; // Import the CsvComponent
import './index.css'; // Import CSS file for styling

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [showCsvComponent, setShowCsvComponent] = useState(false); // State to manage visibility of CsvComponent
  const [showWeatherInfo, setShowWeatherInfo] = useState(false); // State to manage visibility of weather information

  const API_KEY = '895284fb2d2c50a520ea537456963d9c';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${API_KEY}`;

  const searchLocation = () => {
    axios.get(url).then((response) => {
      setData(response.data);
      setShowWeatherInfo(true); // Show weather information when new location is searched
    }).catch((error) => {
      console.error('Error fetching weather data:', error);
      setShowWeatherInfo(false); // Hide weather information if there's an error
    });
    setLocation('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      searchLocation();
    }
  };

  const handleButtonClick = () => {
    searchLocation();
    setShowCsvComponent(true); // Show CsvComponent when button is clicked
  };

  return (
    <div className="app">
      <div className="container">
        <div className="search">
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter Location"
            type="text"
          />
          <button className="weather-button" onClick={handleButtonClick}>Weather Information</button>
        </div>
        {showCsvComponent && <CsvComponent />} {/* Render CsvComponent if showCsvComponent is true */}
        <div className="weather-info">
          {showWeatherInfo && (
            <div>
              <div className="location">
                <p>{data.name}</p>
              </div>
              <div className="temp">{data.main ? <h1>{data.main.temp.toFixed()}°F</h1> : null}</div>
              <div className="description">{data.weather ? <p>{data.weather[0].main}</p> : null}</div>
              <div className="bottom">
                <div className="feels">
                  {data.main ? <p>Feels Like: {data.main.feels_like.toFixed()}°F</p> : null}
                </div>
                <div className="humidity">
                  {data.main ? <p>Humidity: {data.main.humidity}%</p> : null}
                </div>
                <div className="wind">
                  {data.wind ? <p>Wind Speed: {data.wind.speed.toFixed()} MPH</p> : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
