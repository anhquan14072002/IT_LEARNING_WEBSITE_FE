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
  getTopicById,
} from "../../services/lesson.api";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { Button } from "primereact/button";

export default function Lesson() {
  const fixedDivRef = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const [isDisplay, setIsDisplay] = useState(false);
  const displayRef = useRef(null);
  const [topic, setTopic] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingV1, setLoadingV1] = useState(false);
  const [documentList, setDocumentList] = useState({});
  const { id } = useParams();

  useEffect(() => {
    getTopicById(id, setLoading, setTopic);
    // getDocumentListByLessonId(id, setLoadingV1, setDocumentList);
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
    window.open(`${lesson?.urlDownload}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div ref={fixedDivRef} className="fixed top-0 w-full z-10">
        <Header />
        <Menu />
      </div>
      <div style={{ paddingTop: `${fixedDivHeight}px` }} className="flex gap-5">
        <LessonInDocument display={isDisplay} documentList={documentList} />

        <div className="pt-6 flex-1">
          {loading ? (
            <Loading />
          ) : Object.keys(topic).length > 0 ? (
            <div>
              <h2 className="text-xl font-bold mb-5">{topic?.title}</h2>
              <div>
                <span className="font-semibold mb-2">Mục tiêu chủ đề :</span>
                {topic?.objectives}
              </div>
              <div>
                <span className="font-semibold">Nội dung chủ đề :</span>
                {topic?.description}
              </div>
            </div>
          ) : (
            <p>No topic data found.</p>
          )}
        </div>
      </div>

      <Footer ref={displayRef} />
    </div>
  );
}
