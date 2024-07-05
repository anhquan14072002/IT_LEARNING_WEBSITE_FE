import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import Footer from "../../components/Footer";
import CategoryOfClass from "../../components/CategoryOfClass";
import DocumentClass from "../../components/DocumentClass";
import Comment from "../../components/Comment";
import LessonInDocument from "../../components/LessonInDocument";
import {
  getDocumentListByLessonId,
  getLessonById,
} from "../../services/lesson.api";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { Button } from "primereact/button";
import restClient from "../../services/restClient";
import { decodeIfNeeded, isBase64 } from "../../utils";

export default function Lesson() {
  const fixedDivRef = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const [isDisplay, setIsDisplay] = useState(false);
  const displayRef = useRef(null);
  const [lesson, setLesson] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingV1, setLoadingV1] = useState(false);
  const [documentList, setDocumentList] = useState({});
  const { id } = useParams();

  const fetchData = async () => {
    try {
      const responseTopic = await restClient({
        url: `api/index/getalllessonindex/${id}`,
        method: "GET",
      });

      console.log("Response Topic:", responseTopic);

      const lessonId = responseTopic.data?.data?.id;

      if (lessonId) {
        const responseMenu = await restClient({
          url: `api/index/getalldocumentindex/${lessonId}`,
          method: "GET",
        });

        console.log("Response Menu:", responseMenu);

        setDocumentList(responseMenu.data?.data);
      } else {
        console.log("Lesson ID not found in response data.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Optionally, you can set an error state or handle the error in another way
    }
  };

  useEffect(() => {
    getLessonById(id, setLoading, setLesson);
    fetchData();
  }, [id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsDisplay(true);
          } else {
            setIsDisplay(false);
          }
        });
      },
      {
        threshold: 0,
      }
    );

    if (displayRef.current) {
      observer.observe(displayRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (fixedDivRef.current) {
      setFixedDivHeight(fixedDivRef.current.offsetHeight);
    }
  }, [fixedDivRef]);

  const handleDownload = () => {
    window.open(`${lesson?.urlDownload}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div ref={fixedDivRef} className="fixed top-0 w-full z-50">
        <Header />
        <Menu />
      </div>
      <div style={{ paddingTop: `${fixedDivHeight}px` }} className="flex gap-5">
        <LessonInDocument
          display={isDisplay}
          documentList={documentList}
          lessonId={id}
        />

        <div className="pt-6 flex-1">
          {loading ? (
            <Loading />
          ) : Object.keys(lesson).length > 0 ? (
            <>
              <div>
                <h2 className="text-xl font-bold">{lesson?.title}</h2>
                <div className="flex justify-end mb-5">
                  <Button
                    label="Tải tài liệu về máy"
                    icon="pi pi-download"
                    className="bg-blue-500 hover:bg-blue-300 p-2 text-white text-sm"
                    onClick={handleDownload}
                  />
                </div>

                {/* Add more details based on your lesson object */}
              </div>
              {isBase64(lesson.content) ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: decodeIfNeeded(lesson.content),
                  }}
                />
              ) : (
                <div
                  className="ql-editor" // Add Quill's class if necessary
                  dangerouslySetInnerHTML={{
                    __html: lesson.content,
                  }}
                />
              )}
            </>
          ) : (
            <p>No lesson data found.</p>
          )}
        </div>
      </div>

      <Footer ref={displayRef} />
    </div>
  );
}
