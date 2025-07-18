export function WeatherChart({ currentTemp, chartData }) {

  const maxVal = Math.max(...chartData.map((d) => d.value))
  const minVal = Math.min(...chartData.map((d) => d.value))
  const range = maxVal - minVal
  const scaleY = (value) => ((value - minVal) / range) * 80 + 10 

  const points = chartData.map((d, i) => `${(i / (chartData.length - 1)) * 100},${100 - scaleY(d.value)}`).join(" ")

  const currentTempX = (2 / (chartData.length - 1)) * 100 
  const currentTempY = 100 - scaleY(currentTemp)

  return (
    <div className="weather-chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Temperature</h3>
      </div>
      <div className="chart-content">
        <div className="chart-svg-wrapper">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="chart-svg">
            {/* Background wave */}
            <path
              d={`M0,100 L${points} L100,100 Z`}
              fill="rgba(59, 130, 246, 0.1)" 
              stroke="none"
            />
            {/* Line graph */}
            <polyline
              points={points}
              fill="none"
              stroke="rgb(59, 130, 246)" 
              strokeWidth="2"
            />
            {/* Current temperature marker */}
            <circle cx={currentTempX} cy={currentTempY} r="2" fill="rgb(59, 130, 246)" />
            <text
              x={currentTempX + 3}
              y={currentTempY - 3}
              fontSize="8"
              fill="rgb(59, 130, 246)"
              className="chart-temp-label"
            >
              {currentTemp}°F
            </text>
          </svg>
        </div>
      </div>
    </div>
  )
}
