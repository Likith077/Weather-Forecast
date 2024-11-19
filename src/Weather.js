// weather.js

import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Weather.css';

const apiKey = '01dd2e991539182eac3f40b0dc40174f';

const Weather = () => {
  const [city, setCity] = useState('');
  const [fourDayForecast, setFourDayForecast] = useState(null);
  const [error, setError] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const mapContainer = document.getElementById('your-map-container-id');

    if (mapContainer && !mapContainer._leaflet_id) {
      const map = L.map('your-map-container-id').setView([0, 0], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© Likith'
      }).addTo(map);

      setMap(map);
    }
  }, []);

  const fetchFourDayForecast = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Oops! Unable to fetch the forecast. Please try again.');
      }

      const data = await response.json();
      setFourDayForecast(data);
      setError(null);

      if (map && data.city) {
        const { lat, lon } = data.city.coord;
        map.setView([lat, lon], 10);

        map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            layer.remove();
          }
        });

        const customIcon = L.divIcon({
          className: 'marker-icon',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
          html: `<img width="17" height="25" src="https://img.icons8.com/ios-filled/50/marker.png" alt="Marker"/>`,
        });

        L.marker([lat, lon], { icon: customIcon }).addTo(map);
      }
    } catch (error) {
      console.error('Error fetching 4-day forecast:', error);
      setError('Oops! Unable to fetch the forecast. Please try again.');
      setFourDayForecast(null);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    fetchFourDayForecast();
  };

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  const groupForecastByDay = (forecastList) => {
    const groupedForecast = {};
    forecastList.forEach((item) => {
      const date = item.dt_txt.split(' ')[0];
      if (!groupedForecast[date]) {
        groupedForecast[date] = item;
      }
    });
    return Object.values(groupedForecast);
  };

  return (
    <div className="app-container">
      <div id="your-map-container-id" className="map-container"></div>
      <div className="forecast-container">
        <h2>Weather Forecast</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Enter city" value={city} onChange={handleInputChange} />
          <button type="submit">Get Forecast</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {fourDayForecast && (
          <div className="forecast-box">
            <h3>6-Days Forecast</h3>
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Temperature (°C)</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {groupForecastByDay(fourDayForecast.list).map((item, index) => (
                  <tr key={index}>
                    <td>{item.dt_txt.split(' ')[0]}</td>
                    <td>{item.main.temp}</td>
                    <td>{item.weather[0].description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
