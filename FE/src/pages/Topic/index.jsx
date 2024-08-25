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
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { Button } from "primereact/button";
import restClient from "../../services/restClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import NotifyProvider from "../../store/NotificationContext";

export default function Topic() {
  const navigate = useNavigate();
  const fixedDivRef = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const [isDisplay, setIsDisplay] = useState(false);
  const displayRef = useRef(null);
  const [topic, setTopic] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingV1, setLoadingV1] = useState(false);
  const [documentList, setDocumentList] = useState({});
  const [tableContentId, setTableContentId] = useState([]);
  const { id } = useParams();
  const [quizFlashcard, setQuizFlashcard] = useState([]);
  const [quizExam, setQuizExam] = useState([]);
  const [problemTopic, setProblemTopic] = useState([]);
  const [tagTopic, setTagTopic] = useState([]);

  const fetchData = async () => {
    try {
      const responseTopic = await restClient({
        url: "api/index/getalltopicindex/" + id,
        method: "GET",
      });

      const responseMenu = await restClient({
        url: `api/index/getalldocumentindex/` + responseTopic.data?.data?.id,
        method: "GET",
      });
      setDocumentList(responseMenu.data?.data);
      console.log("====================================");
      console.log(responseMenu.data?.data);
      console.log("====================================");
    } catch (err) {}
  };

  useEffect(() => {
    restClient({
      url: `api/topic/gettopicbyid?id=${id}`,
      method: "GET",
    })
      .then((res) => {
        if(res.data?.data?.isActive === false){
          navigate('/notfound')
        }
        setTopic(res.data.data || {});
        setLoading(false);
      })
      .catch((err) => {
        setTopic({});
        setLoading(false);
      });
    fetchData();

    restClient({
      url: "api/topic/gettopicidbytag/" + id,
    })
      .then((res) => {
        if (res?.data?.data?.isActive === false) {
          navigate("/notfound");
        }
        setTagTopic(res?.data?.data);
      })
      .catch((err) => {
        setTagTopic([]);
      });
  }, [id]);

  useEffect(() => {
    if (Array.isArray(documentList?.topics)) {
      const mappedData =
        documentList && documentList.topics
          ? documentList.topics.reduce((acc, topic) => {
              acc.push(`topic : ${topic.id}`);

              // Map lessons if present
              if (Array.isArray(topic.lessons)) {
                topic.lessons.forEach((lesson) => {
                  acc.push(`lesson : ${lesson.id}`);
                });
              }

              // Map child topics if present
              if (Array.isArray(topic.childTopics)) {
                topic.childTopics.forEach((childTopic) => {
                  acc.push(`topic : ${childTopic.id}`);

                  // Map lessons of child topic if present
                  if (Array.isArray(childTopic.lessons)) {
                    childTopic.lessons.forEach((lesson) => {
                      acc.push(`lesson : ${lesson.id}`);
                    });
                  }
                });
              }

              return acc;
            }, [])
          : [];
      setTableContentId(mappedData);
    }
  }, [documentList]);

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

  const handlePrevious = () => {
    const idNavi = findPreviousLessonId(tableContentId, id);
    if (idNavi) {
      const key = idNavi.split(" : ")[0];
      const value = idNavi.split(" : ")[1];
      if (key == "lesson") {
        navigate(`/document/${key}/${value}`);
      } else {
        navigate(`/${key}/${value}`);
      }
    }
  };

  const handleNext = () => {
    const idNavi = findNextLessonId(tableContentId, id);
    if (idNavi) {
      const key = idNavi.split(" : ")[0];
      const value = idNavi.split(" : ")[1];
      if (key == "lesson") {
        navigate(`/document/${key}/${value}`);
      } else {
        navigate(`/${key}/${value}`);
      }
    }
  };

  const findNextLessonId = (data, currentLessonId) => {
    // Find the index of the current lesson in the data array
    const currentIndex = data.findIndex((item) => {
      const itemType = item.split(" : ")[0]; // Get item type ("lesson" or "topic")
      const itemId = parseInt(item.split(" : ")[1]); // Get item ID
      return itemType === "topic" && itemId === Number(currentLessonId);
    });

    if (currentIndex === -1 || currentIndex === data?.length - 1) {
      return null;
    }

    // Find the previous lesson ID
    for (let i = currentIndex + 1; i >= 0; i--) {
      const item = data[i];
      return item;
    }

    return null;
  };

  const findPreviousLessonId = (data, currentLessonId) => {
    // Find the index of the current lesson in the data array
    const currentIndex = data.findIndex((item) => {
      const itemType = item.split(" : ")[0]; // Get item type ("lesson" or "topic")
      const itemId = parseInt(item.split(" : ")[1]); // Get item ID
      return itemType === "topic" && itemId === Number(currentLessonId);
    });

    if (currentIndex === -1 || currentIndex === 0) {
      return null;
    }

    // Find the previous lesson ID
    for (let i = currentIndex - 1; i >= 0; i--) {
      const item = data[i];
      return item;
    }

    return null;
  };

  return (
    <NotifyProvider>
      <div className="min-h-screen flex flex-col">
        <div ref={fixedDivRef} className="fixed top-0 w-full z-10">
          <Header />
          <Menu />
        </div>
        <div
          style={{ paddingTop: `${fixedDivHeight}px` }}
          className="flex gap-5"
        >
          <LessonInDocument
            display={isDisplay}
            documentList={documentList}
            topicId={id}
          />

          <div className="pt-6 flex-1 px-2 md:px-0 pb-5 md-pb-0 min-h-screen">
            {loading ? (
              <Loading />
            ) : Object.keys(topic).length > 0 ? (
              <div>
                <div className="flex flex-wrap gap-2 justify-between mb-10">
                  <button
                    onClick={handlePrevious}
                    className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Trang trước
                  </button>
                  <button
                    className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={handleNext}
                  >
                    Trang sau
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </button>
                </div>
                <h2 className="text-xl font-bold mb-5">{topic?.title}</h2>
                <div>
                  <span className="font-semibold mb-2">Mục tiêu chủ đề :</span>
                  {topic?.objectives}
                </div>
                <div>
                  <span className="font-semibold">Nội dung chủ đề :</span>
                  <span
                    className="inline"
                    dangerouslySetInnerHTML={{ __html: topic?.description }}
                  />
                </div>

                {/* tag */}
                {tagTopic.length > 0 && (
                  <div className="mt-6">
                    <span className="block font-semibold mb-3">
                      Các từ khóa liên quan đến chủ đề
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {tagTopic.map((tag) => (
                        <div
                          key={tag.id}
                          className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full shadow-sm hover:bg-blue-200 transition-colors cursor-pointer"
                          onClick={() => navigate("/searchTag/" + tag.id)}
                        >
                          {tag.title}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p>No topic data found.</p>
            )}
          </div>
        </div>

        <Footer ref={displayRef} />
      </div>
    </NotifyProvider>
  );
}
