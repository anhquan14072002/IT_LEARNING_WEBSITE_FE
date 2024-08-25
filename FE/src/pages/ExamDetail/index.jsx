import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import { getExamById } from "../../services/examService";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { highlightPlugin } from "@react-pdf-viewer/highlight";
import "@react-pdf-viewer/highlight/lib/styles/index.css";
import { useNavigate, useParams } from "react-router-dom";
import "./index.css";
import { Toast } from "primereact/toast";
import NotifyProvider from "../../store/NotificationContext";
import Menu from "../../components/Menu";
import restClient from "../../services/restClient";

const ExamDetail = () => {
  const toast = useRef(null);
  const [viewPdf, setViewPdf] = useState(null);
  const [data, setData] = useState([]);
  const [tagList, setTagList] = useState([]);
  const newPlugin = defaultLayoutPlugin();
  const navigate =useNavigate()
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch exam data
        const examResponse = await getExamById(id);
        console.log(examResponse?.data?.data);
        setData(examResponse?.data?.data);
        setViewPdf(examResponse?.data?.data?.examEssayFile);

        // Fetch tag data
        const tagResponse = await restClient({ url: `api/exam/getexamidbytag/${id}`, method: "GET" });
        setTagList(tagResponse?.data?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);
  return (
    <NotifyProvider>
      <Toast ref={toast} />
      <Header />
      <Menu/>
      <div className="m-3 pl-5 ">
        <div className="text-2xl font-semibold mb-4 flex flex-col  ">
          <div > {data?.title}</div>
        </div>
        <div
          className="h-screen w-full flex mt-5 justify-center  items-start"
        >
          <div className="w-3/4 h-full p-4  ">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              {viewPdf ? (
                <Viewer fileUrl={viewPdf} plugins={[newPlugin]} />
              ) : (
                <div>No PDF</div>
              )}
            </Worker>
          </div>
          {data?.urlDownloadSolutionFile && (
          <div><a href={data?.urlDownloadSolutionFile}><button  className="bg-blue-600 mt-5  text-white p-2 text-sm font-normal border border-blue-500 "> Tải Lời Giải</button></a> </div>
          )}
        </div>
        {tagList.length > 0 && (
                  <div className="mt-6 flex">
                    <span className="block font-semibold mr-3">
                      Các từ khóa liên quan:
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {tagList.map((tag) => (
                        <div
                          key={tag.id}
                          className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full shadow-sm hover:bg-blue-200 transition-colors cursor-pointer"
                          onClick={()=>navigate('/searchTag/' + tag.id)}
                        >
                          {tag.title}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
      </div>
    </NotifyProvider>
  );
};

export default ExamDetail;
