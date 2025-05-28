import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = 'c78f9835dc3b98f50ebb0a6a98a5279d';

  const getWeather = async () => {
    if (!city) {
      setError('Please enter a city name.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
      setError('');
    } catch (err) {
      setError('City not found or API error.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Extract graph data from forecast list
  const graphData = weather?.list?.slice(0, 8).map((entry) => ({
    time: entry.dt_txt.split(' ')[1].slice(0, 5), // hour:minute
    temp: entry.main.temp
  }));

  return (
    <div className="app-container">
      <h1 className="title">🌤️ Weather App</h1>
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeather}>Search</button>
      </div>

      {loading && <p className="info-text">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-info">
          <h2>{weather.city.name}, {weather.city.country}</h2>
          <p className="description">{weather.list[0].weather[0].description}</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.list[0].weather[0].icon}@2x.png`}
            alt={weather.list[0].weather[0].description}
          />
          <p className="temp">Current Temperature: {weather.list[0].main.temp} °C</p>
          <h3 className="graph-title">Temperature Trend (Next 24 Hours)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis unit="°C" />
              <Tooltip />
              <Line type="monotone" dataKey="temp" stroke="#ff7300" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default App;
