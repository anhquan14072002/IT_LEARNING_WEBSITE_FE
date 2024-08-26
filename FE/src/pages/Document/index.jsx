import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import Footer from "../../components/Footer";
import CategoryOfClass from "../../components/CategoryOfClass";
import DocumentClass from "../../components/DocumentClass";
import Comment from "../../components/Comment";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import { useSelector } from "react-redux";
import restClient from "../../services/restClient";
import { isLoggedIn } from "../../utils";
import NotifyProvider from "../../store/NotificationContext";

export default function Document() {
  const navigate = useNavigate();
  const toast = useRef(null);
  const fixedDivRef = useRef(null);
  const { id } = useParams();
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const [isDisplay, setIsDisplay] = useState(false);
  const displayRef = useRef(null);
  const [documentDetailArrayList, setDocumentDetailArrayList] = useState({});
  const [loadingDocument, setLoadingDocument] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listCommentByUser, setListCommentByUser] = useState([]);
  const [loadingComment, setLoadingComment] = useState(false);
  const user = useSelector((state) => state.user.value);
  const [document, setDocument] = useState(null);

  useEffect(() => {
    restClient({
      url: `api/document/getdocumentbyid/` + id,
      method: "GET",
    })
      .then((res) => {
        if (res?.data?.data?.isActive === false) {
          navigate("/notfound");
        }
        setDocument(res?.data?.data);
      })
      .catch((err) => {
        setDocument([]);
      });
    restClient({
      url: `api/index/getalldocumentindex/` + id,
      method: "GET",
    })
      .then((res) => {
        setDocumentDetailArrayList(res.data?.data);
      })
      .catch((err) => {
        setDocumentDetailArrayList([]);
      });
  }, []);

  useEffect(() => {
    fetDocumentByUser();
  }, [user]);

  const fetDocumentByUser = () => {
    if (user && user.sub) {
      restClient({
        url:
          `api/commentdocument/getallcommentdocumentbyuseridpagination?userId=` +
          user.sub +
          "&documentId=" +
          id,
        method: "GET",
      })
        .then((res) => {
          setListCommentByUser(res.data.data || []);
        })
        .catch((err) => {
          setListCommentByUser([]);
        });
    }
  };

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
        threshold: 0.5,
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

  return (
    <NotifyProvider>
      <div className="min-h-screen flex flex-col">
        <Toast ref={toast} />
        <div ref={fixedDivRef} className="fixed top-0 w-full z-10">
          <Header />
          <Menu />
        </div>
        <div
          style={{ paddingTop: `${fixedDivHeight}px` }}
          className="flex gap-5"
        >
          <DocumentClass display={isDisplay} />

          {/* <div className="pt-6 flex-1"> */}
          <div className="pt-6 flex-1 md:basis-10/12">
            {documentDetailArrayList && (
              <>
                <div className="min-h-screen">
                  <div className="flex flex-col md:flex-row items-start mb-8">
                    <img
                      src={document?.image}
                      alt={document?.title}
                      className="w-52 h-56 object-cover rounded-lg shadow-lg"
                    />
                    <div className="ml-6">
                      <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {document?.title}
                      </h1>
                      <p className="text-lg text-gray-700 mb-1">
                        <span className="font-semibold">Tác giả:</span>{" "}
                        {document?.author}
                      </p>
                      <p className="text-lg text-gray-700 mb-1">
                        <span className="font-semibold">Năm xuất bản:</span>{" "}
                        {document?.publicationYear}
                      </p>
                      <p className="text-lg text-gray-700 mb-1">
                        <span className="font-semibold">Tái bản lần thứ:</span>{" "}
                        {document?.edition}
                      </p>
                      <p className="text-lg text-gray-700 mb-1">
                        <span className="font-semibold">Loại sách:</span>{" "}
                        {document?.typeOfBook}
                      </p>
                      <p className="text-lg text-gray-700 mb-1">
                        <span className="font-semibold">Sách lớp:</span>{" "}
                        {document?.gradeTitle}
                      </p>
                      <p className="text-lg text-gray-700 mb-1">
                        <span className="font-semibold">
                          Điểm đánh giá trung bình:
                        </span>{" "}
                        {document?.averageRating}
                      </p>
                      <p className="text-lg text-gray-700">
                        <span className="font-semibold">
                          Tổng số lượt đánh giá:
                        </span>{" "}
                        {document?.totalReviewer}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2 underline">
                      Giới thiệu chi tiết về sách
                    </h2>
                    <p
                      className="text-lg text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: document?.description,
                      }}
                    ></p>
                  </div>

                  {documentDetailArrayList?.topics && Array.isArray(documentDetailArrayList?.topics) && documentDetailArrayList?.topics?.length > 0 && (
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2 underline mt-5">
                      Mục lục
                    </h2>
                  )}
                  <div className="flex flex-wrap">
                    {documentDetailArrayList?.topics &&
                      documentDetailArrayList?.topics?.map((topic, index) => (
                        <div key={index} className="w-full md:w-1/2 mb-4 px-2">
                          <div className="border rounded p-4">
                            <h2
                              className="font-semibold hover:text-green-600 cursor-pointer"
                              onClick={() => navigate("/topic/" + topic?.id)}
                            >
                              {topic?.title}
                            </h2>
                            <ul className="list-disc pl-6">
                              {Array.isArray(topic.lessons) &&
                                topic.lessons.map((lesson, i) => (
                                  <li
                                    key={i}
                                    className="hover:text-green-600 cursor-pointer"
                                    onClick={() =>
                                      navigate("/document/lesson/" + lesson.id)
                                    }
                                  >
                                    {lesson.title}
                                  </li>
                                ))}
                            </ul>
                            {Array.isArray(topic.childTopics) &&
                              topic.childTopics.map((childTopic, idx) => (
                                <div key={idx} className="ml-4 mt-2">
                                  <h3
                                    className="font-semibold hover:text-green-600 cursor-pointer"
                                    onClick={() =>
                                      navigate("/topic/" + childTopic.id)
                                    }
                                  >
                                    {childTopic.title}
                                  </h3>
                                  <ul className="list-disc pl-6">
                                    {Array.isArray(childTopic.lessons) &&
                                      childTopic.lessons.map((lesson, i) => (
                                        <li
                                          key={i}
                                          className="hover:text-green-600 cursor-pointer"
                                          onClick={() =>
                                            navigate(
                                              "/document/lesson/" + lesson.id
                                            )
                                          }
                                        >
                                          {lesson.title}
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                {/* comment */}
                <Comment
                  documentId={id}
                  toast={toast}
                  listCommentByUser={listCommentByUser}
                  fetDocumentByUser={fetDocumentByUser}
                />
              </>
            )}
          </div>
        </div>

        <Footer ref={displayRef} />
      </div>
    </NotifyProvider>
  );
}
