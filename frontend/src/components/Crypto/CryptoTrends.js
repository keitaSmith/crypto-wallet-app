import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // Ensure date-fns adapter is installed

import axios from 'axios';
import '../../styles/CryptoTrends.css';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CryptoTrends = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/ethereum-prices');
        const prices = response.data;

        const formattedData = prices.map((item) => ({
          x: new Date(item.time).toISOString(), // Ensure correct date format
          y: parseFloat(item.priceUsd),
        }));

        console.log('Formatted data:', formattedData);

        setChartData({
          datasets: [
            {
              label: 'Ethereum Price',
              data: formattedData,
              borderColor: 'rgba(75, 192, 192, 1)',
              fill: false,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!chartData) {
    return <div>Loading chart data...</div>;
  }

  return (
    <div className="crypto-trends-container">
      <h3>Ethereum Price Trends</h3>
      <Line
        data={chartData}
        options={{
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
              },
            },
          },
        }}
      />
    </div>
  );
};

export default CryptoTrends;
