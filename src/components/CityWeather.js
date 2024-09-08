import {useParams} from 'react-router-dom'
import axios from 'axios'
import React, {useState, useEffect} from 'react'

const CityWeather = () => {
  const {cityName} = useParams()
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`,
        )
        setWeather(response.data)
      } catch (error) {
        console.error('Error fetching weather data', error)
      }
    }
    fetchWeather()
  }, [cityName])

  if (!weather) return <p>Loading...</p>

  return (
    <div>
      <h2>{cityName} Weather</h2>
      <p>Temperature: {weather.main.temp}°C</p>
      <p>Humidity: {weather.main.humidity}%</p>
      <p>Wind Speed: {weather.wind.speed} m/s</p>
    </div>
  )
}

export default CityWeather
