import React, { useEffect, useState } from "react";
import { Chart } from "primereact/chart"; // Thành phần biểu đồ PrimeReact
import restClient from "../../services/restClient";

// Hàm để sinh ra các năm từ startYear đến endYear
const generateYears = (startYear, endYear) => {
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year.toString());
  }
  return years;
};

export default function ManageStatistic() {
  const [loading, setLoading] = useState(true);

  // Biến trạng thái cho các dropdown
  const [documentYear, setDocumentYear] = useState("2024");
  const [topicYear, setTopicYear] = useState("2024");
  const [lessonYear, setLessonYear] = useState("2024");

  // Trạng thái dữ liệu biểu đồ
  const [chartData, setChartData] = useState({
    line: { labels: [], datasets: [] }, // Dữ liệu biểu đồ đường
    bar: { labels: [], datasets: [] }, // Dữ liệu biểu đồ cột
    pie: { labels: [], datasets: [] }, // Dữ liệu biểu đồ hình tròn
    radar: { labels: [], datasets: [] }, // Dữ liệu biểu đồ radar
  });

  // Sinh ra các năm từ 2000 đến 2024
  const years = generateYears(2000, 2024);

  useEffect(() => {
    restClient({ url: "api/statistic/countuserbyrole" }).then((res) => {});
  }, []);

  // Lấy và cập nhật số liệu thống kê dựa trên năm
  const fetchStatistics = async () => {
    setLoading(true);
    try {
      // Lấy dữ liệu từ API dựa trên năm đã chọn
      const documentRes = await restClient({
        url: `api/statistic/documentstatistic/${documentYear}`,
      });
      const topicRes = await restClient({
        url: `api/statistic/topicstatistic/${topicYear}`,
      });
      const lessonRes = await restClient({
        url: `api/statistic/lessonstatistic/${lessonYear}`,
      });
      const userRes = await restClient({ url: "api/statistic/countuserbyrole" });

      // Xử lý dữ liệu cho biểu đồ
      const processData = (data) => {
        const labels = data.map((item) => `Tháng ${item.month}`);
        const values = data.map((item) => item.count);
        return { labels, dataValues: values };
      };

      const processRoleData = (data) => {
        const labels = data.map((item) => item.name);
        const values = data.map((item) => item.countUser);
        return { labels, dataValues: values };
      };

      const documentData = processData(documentRes.data.data);
      const topicData = processData(topicRes.data.data);
      const lessonData = processData(lessonRes.data.data);
      const userStatistic = processRoleData(userRes?.data?.data)

      setChartData({
        line: {
          labels: lessonData.labels,
          datasets: [
            {
              label: "Bài học",
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
              label: "Chủ đề",
              data: topicData.dataValues,
              backgroundColor: "#42A5F5",
              borderColor: "#1E88E5",
              borderWidth: 1,
            },
          ],
        },
        pie: {
          labels: userStatistic.labels,
          datasets: [
            {
              label: "Bài học",
              data: userStatistic.dataValues,
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
              label: "Tài liệu",
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
      console.error("Lỗi khi lấy hoặc xử lý số liệu thống kê:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lấy dữ liệu khi component mount và khi giá trị dropdown thay đổi
  useEffect(() => {
    fetchStatistics();
  }, [documentYear, topicYear, lessonYear]);

  return (
    <div>
      <h1 className="font-bold text-xl mb-10">Thống kê</h1>

      {/* Container Flex cho các biểu đồ */}
      <div className="flex justify-center items-center flex-wrap">
        {/* Phần Biểu đồ hình tròn */}
        <div className="basis-1/2">
          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <Chart
              className="h-96"
              type="pie"
              data={chartData.pie}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Số liệu thống kê người dùng trong hệ thống",
                  },
                  legend: {
                    display: true,
                  },
                },
              }}
            />
          )}
        </div>

        {/* Phần Biểu đồ đường */}
        <div className="basis-1/2">
          <div className="select-container">
            <label htmlFor="documentYearSelect">Chọn Năm : </label>
            <select
              className="border-2 border-black rounded-lg"
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
            <p>Đang tải...</p>
          ) : (
            <Chart
              type="line"
              data={chartData.radar}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Số liệu thống kê tài liệu được tạo theo tháng",
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

        {/* Phần Biểu đồ đường */}
        <div className="basis-1/2">
          <div className="select-container mt-28">
            <label htmlFor="radarYearSelect">Chọn Năm : </label>
            <select
              className="border-2 border-black rounded-lg"
              id="radarYearSelect"
              value={lessonYear} // Giả sử bạn muốn sử dụng cùng một năm cho radar
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
            <p>Đang tải...</p>
          ) : (
            <Chart
              type="line"
              data={chartData.line}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Số liệu thống kê bài học được tạo theo tháng",
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

        {/* Phần Biểu đồ cột */}
        <div className="basis-1/2">
          <div className="select-container mt-28">
            <label htmlFor="topicYearSelect">Chọn Năm : </label>
            <select
              className="border-2 border-black rounded-lg"
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
            <p>Đang tải...</p>
          ) : (
            <Chart
              type="bar"
              data={chartData.bar}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Số liệu thống kê chủ đề được tạo theo tháng",
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
