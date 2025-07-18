import { Cloud } from "lucide-react"

export function CurrentWeatherDisplay({
  currentTime,
  currentDate,
  currentTemp,
  currentDescription,
  currentHumidity,
  currentWindSpeed,
}) {
  return (
    <div className="current-weather-display">
      <div className="time-date">
        {currentTime}, {currentDate}
      </div>
      <div className="temp-icon-group">
        <Cloud className="weather-icon" />
        <div className="temperature">
          {currentTemp}
          <span className="temp-unit">°F</span>
        </div>
      </div>
      <div className="description">{currentDescription}</div>
      <div className="details-group">
        <div className="detail-item">
          <span className="detail-label">Humidity</span>
          <span>{currentHumidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Wind speed</span>
          <span>{currentWindSpeed} km/j</span>
        </div>
      </div>
    </div>
  )
}
