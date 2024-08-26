import React, { useEffect, useState } from "react";
import { Chart } from "primereact/chart"; // PrimeReact chart component
import restClient from "../../services/restClient";

// Function to generate years from startYear to endYear
const generateYears = (startYear, endYear) => {
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year.toString());
  }
  return years;
};

export default function ManageStatistic() {
  const [loading, setLoading] = useState(true);

  // State variables for dropdowns
  const [documentYear, setDocumentYear] = useState("2024");
  const [topicYear, setTopicYear] = useState("2024");
  const [lessonYear, setLessonYear] = useState("2024");

  // Chart data state
  const [chartData, setChartData] = useState({
    line: { labels: [], datasets: [] }, // Line chart data
    bar: { labels: [], datasets: [] }, // Bar chart data
    pie: { labels: [], datasets: [] }, // Pie chart data
    radar: { labels: [], datasets: [] }, // Radar chart data
  });

  // Generate years from 2000 to 2024
  const years = generateYears(2000, 2024);

  useEffect(() => {
    restClient({ url: "api/statistic/countuser" }).then((res) => {});
  }, []);

  // Fetch and update statistics based on the year
  const fetchStatistics = async () => {
    setLoading(true);
    try {
      // Fetch data from APIs based on selected year
      const documentRes = await restClient({
        url: `api/statistic/documentstatistic/${documentYear}`,
      });
      const topicRes = await restClient({
        url: `api/statistic/topicstatistic/${topicYear}`,
      });
      const lessonRes = await restClient({
        url: `api/statistic/lessonstatistic/${lessonYear}`,
      });

      // Process data for chart
      const processData = (data) => {
        const labels = data.map((item) => `Tháng  ${item.month}`);
        const values = data.map((item) => item.count);
        return { labels, dataValues: values };
      };

      const documentData = processData(documentRes.data.data);
      const topicData = processData(topicRes.data.data);
      const lessonData = processData(lessonRes.data.data);

      setChartData({
        line: {
          labels: lessonData.labels,
          datasets: [
            {
              label: "Lesson Radar",
              data: lessonData.dataValues,
              backgroundColor: "rgba(66, 165, 245, 0.2)",
              borderColor: "#42A5F5",
              borderWidth: 2,
              pointBackgroundColor: "#42A5F5",
            },
          ],
        },
        bar: {
          labels: topicData.labels,
          datasets: [
            {
              label: "Topics",
              data: topicData.dataValues,
              backgroundColor: "#42A5F5",
              borderColor: "#1E88E5",
              borderWidth: 1,
            },
          ],
        },
        pie: {
          labels: lessonData.labels,
          datasets: [
            {
              label: "Lessons",
              data: lessonData.dataValues,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#F8E71C",
                "#FF9F40",
              ],
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        },
        radar: {
          labels: documentData.labels,
          datasets: [
            {
              label: "Documents",
              data: documentData.dataValues,
              borderColor: "#42A5F5",
              backgroundColor: "rgba(66, 165, 245, 0.2)",
              borderWidth: 2,
              fill: true,
            },
          ],
        },
      });
    } catch (error) {
      console.error("Error fetching or processing statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when any dropdown value changes
  useEffect(() => {
    fetchStatistics();
  }, [documentYear, topicYear, lessonYear]);

  return (
    <div>
      <h1 className="font-bold text-xl mb-10">Thống kê</h1>

      {/* Flex Container for Charts */}
      <div className="flex flex-wrap">
        {/* Pie Chart Section */}
        <div className="basis-1/2">
          <div className="select-container">
            <label htmlFor="lessonYearSelect">Select Lesson Year: </label>
            <select
              id="lessonYearSelect"
              value={lessonYear}
              onChange={(e) => setLessonYear(e.target.value)}
            >
              {years.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Chart
              type="pie"
              data={chartData.pie}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Lessons Distribution",
                  },
                  legend: {
                    display: true,
                  },
                },
              }}
            />
          )}
        </div>

        {/* Radar Chart Section */}
        <div className="basis-1/2">
          <div className="select-container">
            <label htmlFor="documentYearSelect">Select Document Year: </label>
            <select
              id="documentYearSelect"
              value={documentYear}
              onChange={(e) => setDocumentYear(e.target.value)}
            >
              {years.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Chart
              type="radar"
              data={chartData.radar}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Documents Over Time",
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
          )}
        </div>

        {/* Line Chart Section */}
        <div className="basis-1/2">
          <div className="select-container mt-28">
            <label htmlFor="radarYearSelect">Select Radar Year: </label>
            <select
              id="radarYearSelect"
              value={lessonYear} // Assuming you want to use the same year for radar
              onChange={(e) => setLessonYear(e.target.value)}
            >
              {years.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Chart
              type="line"
              data={chartData.line}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Lesson Statistics Radar",
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
          )}
        </div>

        {/* Bar Chart Section */}
        <div className="basis-1/2">
          <div className="select-container mt-28">
            <label htmlFor="topicYearSelect">Select Topic Year: </label>
            <select
              id="topicYearSelect"
              value={topicYear}
              onChange={(e) => setTopicYear(e.target.value)}
            >
              {years.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Chart
              type="bar"
              data={chartData.bar}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Topics Over Time",
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
          )}
        </div>
      </div>
    </div>
  );
}
