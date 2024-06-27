import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import Footer from "../../components/Footer";
import CategoryOfClass from "../../components/CategoryOfClass";
import DocumentClass from "../../components/DocumentClass";
import Comment from "../../components/Comment";
import LessonInDocument from "../../components/LessonInDocument";
import { getLessonById } from "../../services/lesson.api";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { Button } from "primereact/button";

export default function Lesson() {
  const fixedDivRef = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const [isDisplay, setIsDisplay] = useState(false);
  const displayRef = useRef(null);
  const [lesson, setLesson] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    getLessonById(id, setLoading, setLesson);
  }, []);

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
    window.open(
      `${lesson?.urlDownload}`
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div ref={fixedDivRef} className="fixed top-0 w-full z-10">
        <Header />
        <Menu />
      </div>
      <div style={{ paddingTop: `${fixedDivHeight}px` }} className="flex gap-5">
        <LessonInDocument display={isDisplay} />

        <div className="pt-6 flex-1">
          {loading ? (
            <Loading />
          ) : Object.keys(lesson).length > 0 ? (
            <div>
              <h2 className="text-3xl font-bold">{lesson?.title}</h2>
              <div className="flex justify-end">
                <Button
                  label="Tải tài liệu về máy"
                  icon="pi pi-download"
                  className="bg-blue-500 hover:bg-blue-300 p-2 text-white text-sm"
                  onClick={handleDownload}
                />
              </div>
              <p
                className="mt-4 text-lg"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              ></p>
              {/* Add more details based on your lesson object */}
            </div>
          ) : (
            <p>No lesson data found.</p>
          )}
        </div>
      </div>

      <Footer ref={displayRef} />
    </div>
  );
}
