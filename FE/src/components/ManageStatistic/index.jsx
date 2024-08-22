import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart'; // PrimeReact chart component

export default function ManageStatistic() {
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({
    line: { labels: [], datasets: [] },   // Line chart data
    bar: { labels: [], datasets: [] },    // Bar chart data
    pie: { labels: [], datasets: [] },    // Pie chart data
    radar: { labels: [], datasets: [] },  // Radar chart data
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        // Fake data for demonstration
        const fakeData = [
          { period: 'January', count: 25 },
          { period: 'February', count: 30 },
          { period: 'March', count: 45 },
          { period: 'April', count: 40 },
          { period: 'May', count: 55 },
          { period: 'June', count: 50 },
        ];

        const labels = fakeData.map(item => item.period);
        const dataValues = fakeData.map(item => item.count);

        setChartData({
          line: {
            labels: labels,
            datasets: [
              {
                label: 'Line Chart Example',
                data: dataValues,
                borderColor: '#42A5F5',
                backgroundColor: 'rgba(66, 165, 245, 0.2)',
                borderWidth: 2,
                fill: true,
              },
            ],
          },
          bar: {
            labels: labels,
            datasets: [
              {
                label: 'Bar Chart Example',
                data: dataValues,
                backgroundColor: '#42A5F5',
                borderColor: '#1E88E5',
                borderWidth: 1,
              },
            ],
          },
          pie: {
            labels: labels,
            datasets: [
              {
                label: 'Pie Chart Example',
                data: dataValues,
                backgroundColor: [
                  '#FF6384',
                  '#36A2EB',
                  '#FFCE56',
                  '#4BC0C0',
                  '#F8E71C',
                  '#FF9F40',
                ],
                borderColor: '#fff',
                borderWidth: 2,
              },
            ],
          },
          radar: {
            labels: labels,
            datasets: [
              {
                label: 'Radar Chart Example',
                data: dataValues,
                backgroundColor: 'rgba(66, 165, 245, 0.2)',
                borderColor: '#42A5F5',
                borderWidth: 2,
                pointBackgroundColor: '#42A5F5',
              },
            ],
          },
        });
      } catch (error) {
        console.error('Error processing statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div>
      <h1>User Accounts Statistics</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ flex: '1 1 45%', minWidth: '300px' }}>
            <h2>Line Chart</h2>
            <Chart
              type="line"
              data={chartData.line}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: 'Line Chart Example',
                  },
                  legend: {
                    display: true,
                  },
                },
                scales: {
                  x: {
                    beginAtZero: true,
                  },
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>

          <div style={{ flex: '1 1 45%', minWidth: '300px' }}>
            <h2>Bar Chart</h2>
            <Chart
              type="bar"
              data={chartData.bar}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: 'Bar Chart Example',
                  },
                  legend: {
                    display: true,
                  },
                },
                scales: {
                  x: {
                    beginAtZero: true,
                  },
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>

          <div style={{ flex: '1 1 45%', minWidth: '300px' }}>
            <h2>Pie Chart</h2>
            <Chart
              type="pie"
              data={chartData.pie}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: 'Pie Chart Example',
                  },
                  legend: {
                    display: true,
                  },
                },
              }}
            />
          </div>

          <div style={{ flex: '1 1 45%', minWidth: '300px' }}>
            <h2>Radar Chart</h2>
            <Chart
              type="radar"
              data={chartData.radar}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: 'Radar Chart Example',
                  },
                  legend: {
                    display: true,
                  },
                },
                scales: {
                  r: {
                    angleLines: {
                      display: true,
                    },
                    suggestedMin: 0,
                    suggestedMax: 100,
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
