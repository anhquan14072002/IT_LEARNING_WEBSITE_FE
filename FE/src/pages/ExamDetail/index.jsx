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
import { REJECT, SUCCESS } from "../../utils";
import restClient from "../../services/restClient";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";

const ExamDetail = () => {
  const toast = useRef(null);
  const [viewPdf, setViewPdf] = useState(null);
  const [data, setData] = useState([]);
  const newPlugin = defaultLayoutPlugin();
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getExamById(id);
        console.log(response?.data?.data);
        setData(response?.data?.data);
        setViewPdf(response?.data?.data?.examEssayFile);
      } catch (error) {
        console.error("Error fetching exam:", error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <>
      <Toast ref={toast} />
      <Header />
      <div className="m-5 p-5 ">
        <div className="text-2xl font-semibold mb-4 flex flex-col  ">
          <div className="mb-5"> {data?.title}</div>
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
          <div><a href={data?.urlDownloadSolutionFile}><button  className="bg-blue-600 mt-5  text-white p-2 text-sm font-normal border border-blue-500 "> Tải Lời Giải</button></a> </div>
        </div>
       
      </div>
    </>
  );
};

export default ExamDetail;
