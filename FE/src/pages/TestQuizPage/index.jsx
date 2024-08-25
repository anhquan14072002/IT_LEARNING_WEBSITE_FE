import React, { useEffect, useRef, useState } from "react";
import TestQuiz from "../../components/TestQuiz";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import restClient from "../../services/restClient";
import ViewQuestionInTest from "../../components/ViewQuestionInTest";
import LazyComponent from "../../components/LazyComponent";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import Footer from "../../components/Footer";
import { isLoggedIn } from "../../utils";
import NotifyProvider from "../../store/NotificationContext";

export default function TestQuizPage() {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const fixedDivRef = useRef(null);
  const [quizDetail, setQuizDetail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/notfound");
    }
  }, []);

  useEffect(() => {
    if (fixedDivRef.current) {
      setFixedDivHeight(fixedDivRef.current.offsetHeight);
    }
  }, [fixedDivRef, loading]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const quizResponse = await restClient({
          url: `api/quizquestion/getallquizquestionbyquizid?Status=true&QuizId=${id}`,
          method: "GET",
        });

        const quizDetailResponse = await restClient({
          url: `api/quiz/getquizbyid/${id}`,
          method: "GET",
        });

        if (quizDetailResponse.data?.data?.isActive === false) {
          navigate("/notfound");
        }

        if (quizDetailResponse.data?.data) {
          setQuizDetail(quizDetailResponse.data.data);
        } else {
          setQuizDetail({});
        }

        if (Array.isArray(quizResponse.data?.data)) {
          setQuizData(quizResponse.data.data);
        } else {
          setQuizData([]);
        }
      } catch (e) {
        console.error("Error fetching quiz:", e);
        setQuizData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
  return (
    <NotifyProvider>
      <div>
        <div ref={fixedDivRef} className="fixed top-0 w-full z-10">
          <Header />
          <Menu />
        </div>

        {!quizData || (Array.isArray(quizData) && quizData.length === 0) ? (
          <div
            style={{ paddingTop: `${fixedDivHeight}px` }}
            className="min-h-screen"
          >
            <div className="text-center mt-16 text-2xl font-bold text-gray-500">Đề thi không có câu hỏi sẵn có</div>
          </div>
        ) : (
          <div
            style={{ paddingTop: `${fixedDivHeight}px` }}
            className="min-h-screen"
          >
            <ViewQuestionInTest quizData={quizData} quizDetail={quizDetail} />
          </div>
        )}

        <Footer />
      </div>
    </NotifyProvider>
  );
}

// export default function TestQuizPage() {
//   const [quizData, setQuizData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { id } = useParams();

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const quizResponse = await restClient({
//           url: `api/quizquestion/getallquizquestionbyquizidpractice/${id}`,
//           method: 'GET',
//         });
//         if (Array.isArray(quizResponse.data?.data)) {
//           setQuizData(quizResponse.data.data);
//         } else {
//           setQuizData([]);
//         }
//       } catch (e) {
//         console.error('Error fetching quiz:', e);
//         setQuizData([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   return (
//     <div>
//       {loading ? (
//         <div className='flex justify-center items-center h-screen'>
//           <Loading />
//         </div>
//       ) : (
//         <TestQuiz quizData={quizData} />
//       )}
//     </div>
//   );
// }
