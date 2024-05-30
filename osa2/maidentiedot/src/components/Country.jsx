import axios from "axios";
import React, { useEffect, useState } from "react";

const api_key = import.meta.env.VITE_OPEN_WEATHER_API;

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    getWeather(country.latlng[0], country.latlng[1]);
  });

  const getWeather = async (lat, lon) => {
    await axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=${lat}&lon=${lon}&appid=${api_key}`
      )
      .then((response) => setWeather(response.data));
  };

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital[0]}</p>
      <p>Area: {country.area}</p>
      <div>
        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <div>
          <img src={country.flags["png"]} />
        </div>
        {weather && (
          <div>
            <h2>Weather in {country.capital[0]}</h2>
            <p>Temperature: {weather.main.temp} Celcius</p>
            <div>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
              <p>Wind: {weather.wind.speed} mph</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Country;