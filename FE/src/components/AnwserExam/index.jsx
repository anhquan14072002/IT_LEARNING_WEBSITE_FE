import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import Loading from "../Loading";
import { REJECT, SUCCESS } from "../../utils";
import restClient from "../../services/restClient";

export default function AnswerExam({
  visibleExam,
  setVisibleExam,
  examValue,
  toast,
}) {
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [existingAnswers, setExistingAnswers] = useState([]);

  useEffect(() => {
    if (examValue && examValue.numberQuestion) {
      setAnswers(Array(examValue.numberQuestion).fill(""));
    }
    const fetchData = async () => {
      try {
        const response = await restClient({
          url: `api/examanswer/getallexamanswerbyexamcodeid/${examValue.id}`,
          method: "GET",
        });
        const fetchedAnswers = response?.data?.data || [];
        setExistingAnswers(fetchedAnswers);
        setAnswers(
          Array(examValue.numberQuestion)
            .fill("")
            .map((_, index) => {
              const answer = fetchedAnswers.find(
                (item) => item.numberOfQuestion === index + 1
              );
              return answer ? answer.answer : "";
            })
        );
      } catch (error) {
        console.error("Error fetching exam answers:", error);
        REJECT(toast, error.message);
      }
    };
    if (visibleExam) {
      fetchData();
    }
  }, [examValue, visibleExam]);

  const handleSelectChange = (event, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = event.target.value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents default form submission
    console.log(answers);

    // Check if all answers are selected
    if (answers.some((answer) => answer === "")) {
      alert("Phải chọn đủ đáp án mới được kết thúc");
      return;
    }

    const newAnswers = answers.map((answer, index) => ({
      numberOfQuestion: index + 1,
      answer: answer,
    }));

    const updatePromises = newAnswers.map((newAnswer) => {
      const existingAnswer = existingAnswers.find(
        (exAnswer) => exAnswer.numberOfQuestion === newAnswer.numberOfQuestion
      );
      const newAnswers = answers.map((answer, index) => ({
        numberOfQuestion: index + 1,
        answer: answer,
      }));

      const answerUpdateDtos = newAnswers.map((newAnswer) => {
        const existingAnswer = existingAnswers.find(
          (exAnswer) => exAnswer.numberOfQuestion === newAnswer.numberOfQuestion
        );
        return existingAnswer
          ? { ...newAnswer, id: existingAnswer.id }
          : { ...newAnswer };
      });

      if (existingAnswer) {
        // Update existing answer
        return restClient({
          url: `api/examanswer/updaterangeexamanswer`,
          method: "PUT",
          data: {
            examCodeId: examValue?.id,
            answerUpdateDtos: answerUpdateDtos,
          },
        });
      } else {
        // Create new answer
        return restClient({
          url: "api/examanswer/createrangeexamanswer",
          method: "POST",
          data: {
            examCodeId: examValue?.id,
            answerDtos: [newAnswer],
          },
        });
      }
    });

    try {
      setLoading(true);
      await Promise.all(updatePromises);
      SUCCESS(toast, "Cập nhật đáp án thành công");
    } catch (error) {
      console.error("Error updating exam answers:", error);
      REJECT(toast, error.message);
    } finally {
      setLoading(false);
      setVisibleExam(false);
    }
  };

  const renderQuestions = () => {
    const totalQuestions = examValue?.numberQuestion || 0;
    let columnQuestions = 0;
    if (totalQuestions <= 10) {
      columnQuestions = 1;
    } else if (totalQuestions <= 20) {
      columnQuestions = 2;
    } else if (totalQuestions <= 30) {
      columnQuestions = 3;
    } else if (totalQuestions <= 40) {
      columnQuestions = 4;
    } else {
      columnQuestions = 5;
    }

    const questionsPerColumn = Math.ceil(totalQuestions / columnQuestions);

    return Array.from({ length: columnQuestions }, (_, columnIndex) => (
      <div
        key={columnIndex}
        style={{
          width: `${100 / columnQuestions}%`,
          float: "left",
          padding: "0 10px",
        }}
      >
        {[...Array(questionsPerColumn)].map((_, index) => {
          const questionIndex = columnIndex * questionsPerColumn + index;
          if (questionIndex < totalQuestions) {
            return (
              <div key={questionIndex} style={{ marginBottom: "1rem" }}>
                <label
                  htmlFor={`answer-${questionIndex}`}
                  className="text-black mr-2"
                >
                  Câu {questionIndex + 1}:
                </label>
                <select
                  id={`answer-${questionIndex}`}
                  value={answers[questionIndex]}
                  onChange={(e) => handleSelectChange(e, questionIndex)}
                  className="border border-gray-600 rounded-md w-fit text-black"
                >
                  <option value="" disabled>
                    Chọn đáp án
                  </option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
    ));
  };

  return (
    <Dialog
    header={<span style={{ color: 'black', fontSize:'30px' }}>Đáp án</span>}
      className="text-l text-black"
      visible={visibleExam}
      style={{ width: "75vw" }}
      onHide={() => setVisibleExam(false)}
    >
      
      {loading ? (
        <Loading />
      ) : (
        <div>
          <form onSubmit={handleSubmit}>
            <div style={{ overflow: "hidden" }}>{renderQuestions()}</div>
            <div className="mt-4 flex justify-end">
              <Button
                type="submit"
                className="w-1/4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                label={!existingAnswers.length ? "Thêm" : "Sửa"}
              />
            </div>
            
          </form>
        </div>
      )}
    </Dialog>
  );
}
