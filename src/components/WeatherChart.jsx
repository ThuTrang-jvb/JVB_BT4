import React, { useState, useEffect, useRef } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceDot,
  Label,
} from 'recharts';

function WeatherChart({ data }) {
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [selectedChart, setSelectedChart] = useState('temperature');
  const chartRef = useRef(null);

  const chartConfig = {
    temperature: { color: '#5294f0ff', key: 'temp', unit: '°F', name: 'Temperature' },
    uv: { color: '#8b5cf6', key: 'uv', unit: '', name: 'UV Index' },
    humidity: { color: '#14b8a6', key: 'humidity', unit: '%', name: 'Humidity' },
  };

  useEffect(() => {
    if (!data || !data.chartData) {
      setChartData([]);
      return;
    }

    const processedData = data.chartData.temp.map((item, index) => ({
      time: new Date(item.time).getHours(),
      temp: item.value,
      uv: data.chartData.uv[index].value,
      humidity: data.chartData.humidity[index].value,
    }));

    setChartData(processedData);
  }, [data]);

  useEffect(() => {
    if (!data || !data.currentTime || !chartData.length) {
      setCurrentTimeIndex(0);
      return;
    }

    const currentHour = new Date().getHours();
    let newIndex = chartData.findIndex((item) => item.time === currentHour);
    if (newIndex === -1) newIndex = 0;
    setCurrentTimeIndex(newIndex);
  }, [data, chartData]);

  const currentDotDataPoint = chartData[currentTimeIndex] || null;
  const currentConfig = chartConfig[selectedChart];
  const tickFilter = [6, 12, 18];

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-tabs">
          {Object.keys(chartConfig).map((key) => (
            <button
              key={key}
              className={`chart-tab ${selectedChart === key ? 'active' : ''}`}
              onClick={() => setSelectedChart(key)}
            >
              {chartConfig[key].name}
            </button>
          ))}
        </div>
      </div>
      <div style={{ width: '100%' }}>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 40, right: 20, left: 20, bottom: 0 }}>
              <XAxis
                dataKey="time"
                tickFormatter={(val) => `${val}:00`}
                ticks={tickFilter}
              />
              <YAxis hide={true} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(63, 70, 81, 0.9)', borderRadius: '10px', color: '#fff' }}
                formatter={(value) => [`${Math.round(value)}${currentConfig.unit}`, currentConfig.name]}
                labelFormatter={(label) => `${label}:00`}
              />
              <Area
                type="monotone"
                dataKey={currentConfig.key}
                stroke={currentConfig.color}
                fill={currentConfig.color}
                fillOpacity={0.2}
                strokeWidth={2}
                dot={false}
                name={currentConfig.name}
              />
              {currentDotDataPoint && (
                <ReferenceDot
                  x={currentDotDataPoint.time}
                  y={currentDotDataPoint[currentConfig.key]}
                  r={6}
                  fill={currentConfig.color}
                  stroke="white"
                  strokeWidth={2}
                  isFront
                >
                  <Label
                    value={`${Math.round(currentDotDataPoint[currentConfig.key])}${currentConfig.unit}`}
                    position="top"
                    offset={10}
                    fill={currentConfig.color}
                    fontSize={12}
                    fontWeight="bold"
                  />
                </ReferenceDot>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default WeatherChart;
