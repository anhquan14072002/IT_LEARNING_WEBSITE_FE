import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { getExamById } from "../../services/examService";
import {Viewer , Worker } from '@react-pdf-viewer/core';
import {defaultLayoutPlugin} from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { highlightPlugin } from '@react-pdf-viewer/highlight';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import './index.css'
const ExamDetail = () => {
  const [viewPdf, setViewPdf] = useState(null);
  const [data,setData] =useState([])
const newPlugin = defaultLayoutPlugin();
const new1Plugin = highlightPlugin();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getExamById(1);
      console.log(response);
      console.log(response?.data?.data);
      setData(response?.data?.data)
      setViewPdf(response?.data?.data?.examFile);
    };
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <div className="text-xl font-semibold mb-4">{data?.title}</div>
      <div className="h-screen w-full flex mt-5 justify-start items-start">
        <div className="w-3/4 h-3/4 p-4">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        {viewPdf ? (
              <Viewer fileUrl={viewPdf} plugins={[newPlugin,new1Plugin]}  />
            ) : (
              <div>No PDF</div>
            )}
        </Worker>
        </div>
        {/* Right frame containing the answer choices */}
        <div className="w-1/4 h-full border-l border-gray-200 p-4">
          <div className="text-xl font-semibold mb-4">Đáp Án</div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input type="radio" id="answerA" name="answer" value="A" />
              <label htmlFor="answerA">A</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="radio" id="answerB" name="answer" value="B" />
              <label htmlFor="answerB">B</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="radio" id="answerC" name="answer" value="C" />
              <label htmlFor="answerC">C</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="radio" id="answerD" name="answer" value="D" />
              <label htmlFor="answerD">D</label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExamDetail;
