import React, { useEffect, useState } from "react";
import TestQuiz from "../../components/TestQuiz";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import restClient from "../../services/restClient";
import ViewQuestionInTest from "../../components/ViewQuestionInTest";

export default function TestQuizPage() {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const quizResponse = await restClient({
          url: `api/quizquestion/getallquizquestionbyquizidpractice/${id}`,
          method: "GET",
        });
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
    <div>
      <ViewQuestionInTest quizData={quizData}/>
    </div>
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
