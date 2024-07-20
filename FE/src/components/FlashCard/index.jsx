import React from "react";
import "./index.css";

const Flashcard = ({ flashcard, showAnswer, setShowAnswer }) => {
  // Function to convert index to letter (A, B, C, D, ...)
  const indexToLetter = (index) => {
    return String.fromCharCode(65 + index); // ASCII code for 'A' is 65
  };

  const correctAnswer = flashcard?.quizAnswers.find(
    (answer, index) => answer.isCorrect
  );

  return (
    <div className={`max-w-md rounded overflow-hidden bg-white p-6 mb-4`}>
      <>
        {!showAnswer ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-center w-full mb-5" dangerouslySetInnerHTML={{__html:flashcard?.content}}>
                
              </h2>
            </div>
            <div className="flex flex-wrap gap-10">
              {flashcard?.quizAnswers?.map((answer, index) => (
                <div key={index} style={{ flexBasis: "45%" }}>
                  <strong>{indexToLetter(index)}:</strong> {answer?.content}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div>
            <strong>
              {indexToLetter(flashcard?.quizAnswers.indexOf(correctAnswer))}:
            </strong>{" "}
            {correctAnswer?.content}
          </div>
        )}
      </>
    </div>
  );
};

export default Flashcard;

{
  /* {!showAnswer && (
          <button
            onClick={handleShowAnswer}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded"
          >
            Show Answer
          </button>
        )} */
}
{
  /* {showAnswer && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Answer:</h3>
          <p>
            {flashcard?.quizAnswers.find((answer) => answer.isCorrect).content}
          </p>
        </div>
      )} */
}
