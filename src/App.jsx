"use client"

import { useState, useEffect } from "react"
import { CurrentWeatherDisplay } from "./components/CurrentWeatherDisplay"
import { ForecastCard } from "./components/ForecastCard"
import { WeatherChart } from "./components/WeatherChart"
import { mapConditionToIcon, formatDateTime } from "./lib/weather-utils" 
import "./App.css" 

function App() {
  const [city, setCity] = useState("Hanoi") 
  const [weather, setWeather] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
  const BASE_URL = "http://api.weatherapi.com/v1/forecast.json"

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${city}&days=10&aqi=no&alerts=yes`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        const { time: currentTime, date: currentDate } = formatDateTime(data.current.last_updated)

        const currentWeatherData = {
          city: data.location.name,
          currentTime: currentTime,
          currentDate: currentDate,
          currentTemp: data.current.temp_f,
          currentDescription: data.current.condition.text,
          currentHumidity: data.current.humidity,
          currentWindSpeed: data.current.wind_kph, 
        }

        const chartData = data.forecast.forecastday[0].hour
          .filter((_, index) => index % 3 === 0) 
          .slice(0, 7) 
          .map((hour) => ({ value: hour.temp_f }))
        const forecastData = data.forecast.forecastday.slice(0, 4).map((day, index) => ({
          date:
            index === 0 ? "Today" : new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          icon: mapConditionToIcon(day.day.condition.text),
          humidity: day.day.avghumidity,
        }))

        setWeather({
          ...currentWeatherData,
          chartData: chartData,
          forecast: forecastData,
        })
      } catch (e) {
        console.error("Lỗi khi lấy dữ liệu thời tiết:", e)
        setError("Không thể tải dữ liệu thời tiết. Vui lòng thử lại hoặc kiểm tra tên thành phố.")
        setWeather(undefined) 
      } finally {
        setLoading(false)
      }
    }

    if (city) {
      fetchWeatherData()
    }
  }, [city, API_KEY, BASE_URL]) 

  const handleCityChange = (e) => {
    setCity(e.target.value)
  }

  if (loading) {
    return (
      <div className="app-container">
        <div className="weather-card no-data-card">
          <p>Đang tải dữ liệu thời tiết cho "{city}"...</p>
          <div className="input-group">
            <label htmlFor="city-input" className="input-label">
              Your city
            </label>
            <input
              id="city-input"
              type="text"
              placeholder="Enter your city name"
              value={city}
              onChange={handleCityChange}
              className="city-input"
            />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="weather-card no-data-card">
          <p className="error-message">{error}</p>
          <div className="input-group">
            <label htmlFor="city-input" className="input-label">
              Your city
            </label>
            <input
              id="city-input"
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={handleCityChange}
              className="city-input"
            />
          </div>
        </div>
      </div>
    )
  }

  if (!weather) {
    return (
      <div className="app-container">
        <div className="weather-card no-data-card">
          <p>Không tìm thấy dữ liệu thời tiết cho "{city}". Hãy thử "London", "New York", hoặc "Paris".</p>
          <div className="input-group">
            <label htmlFor="city-input" className="input-label">
              Your city
            </label>
            <input
              id="city-input"
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={handleCityChange}
              className="city-input"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="weather-card">
        {/* Cột trái */}
        <div className="weather-column left-column">
          <div className="input-group">
            <label htmlFor="city-input" className="input-label">
              Your city
            </label>
            <input
              id="city-input"
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={handleCityChange}
              className="city-input"
            />
          </div>
          <CurrentWeatherDisplay
            currentTime={weather.currentTime}
            currentDate={weather.currentDate}
            currentTemp={weather.currentTemp}
            currentDescription={weather.currentDescription}
            currentHumidity={weather.currentHumidity}
            currentWindSpeed={weather.currentWindSpeed}
          />
        </div>

        {/* Cột phải */}
        <div className="weather-column right-column">
          <WeatherChart currentTemp={weather.currentTemp} chartData={weather.chartData} />
          <div className="forecast-grid">
            {weather.forecast.map((item, index) => (
              <ForecastCard
                key={item.date}
                date={item.date}
                icon={item.icon}
                humidity={item.humidity}
                isActive={index === 0} // "Today" là thẻ đang hoạt động
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
