import React, { useState, useEffect } from 'react';
import Papa from 'papaparse'; // For parsing CSV
import axios from 'axios'; // For making HTTP requests

const API_KEY = '2cf7f6d143b5c4219a04d321e66506b7';

function CsvComponent() {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    // Fetching data from CSV file
    const fetchData = async () => {
      try {
        const csvFilePath = require('./assets/Weather_data.csv');
        const response = await axios.get(csvFilePath);
        const result = Papa.parse(response.data, { header: true, skipEmptyLines: true });
        const data = result.data;
        fetchDataForCoordinates(data);
      } catch (error) {
        console.error('Error fetching CSV data:', error);
      }
    };

    fetchData();
  }, []);

  const fetchDataForCoordinates = async (data) => {
    const promises = data.map(async (entry) => {
      const { latitude, longitude, wraz } = entry;
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
        const weatherInfo = response.data;
        // Convert temperature from Kelvin to Celsius
        const temperatureInCelsius = weatherInfo.main.temp - 273.15;
        return { latitude, longitude, wraz, temperature: temperatureInCelsius, weatherInfo };
      } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
      }
    });

    Promise.all(promises)
      .then((results) => {
        // Filter out null results
        const filteredResults = results.filter((result) => result !== null);
        setWeatherData(filteredResults);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  };

  const downloadCSV = () => {
    const csvContent = Papa.unparse(weatherData.map(entry => ({
      Latitude: entry.latitude,
      Longitude: entry.longitude,
      Date: entry.wraz,
      Temperature: entry.temperature.toFixed(2),
      Weather: entry.weatherInfo.weather[0].description,
      Humidity: entry.weatherInfo.main.humidity
      // Add more properties as needed
    })));
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'weather_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1>Weather Information</h1>
      <div className="table-container">
        <table className="weather-table">
          <thead>
            <tr>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Date</th>
              <th>Temperature (°C)</th>
              <th>Weather</th>
              <th>Humidity (%)</th>
              {/* Add more columns as needed */}
            </tr>
          </thead>
          <tbody>
            {weatherData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.latitude}</td>
                <td>{entry.longitude}</td>
                <td>{entry.wraz}</td>
                <td>{entry.temperature.toFixed(2)}°C</td>
                <td>{entry.weatherInfo.weather[0].description}</td>
                <td>{entry.weatherInfo.main.humidity}</td>
                {/* Display more weather parameters */}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="button-container">
          <button onClick={downloadCSV}>Download CSV</button>
        </div>
      </div>
    </div>
  );
}

export default CsvComponent;
