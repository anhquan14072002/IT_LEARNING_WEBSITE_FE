import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useContext, useEffect, useState } from "react";
import FormDataContext from "../../store/FormDataContext";
import axios from "axios";
function ImportStepTwo() {
  const [excelValidateResponse, setExcelValidateResponse] = useState([]);
  const { formData, file, checkRecord } = useContext(FormDataContext);
  useEffect(() => {
    const handleUpload = async () => {
      if (!file) {
        alert("Please select a file.");
        return;
      }

      try {
        const response = await axios.post(
          `https://localhost:7000/api/quizquestion/ImportValidate?quizId=1`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          console.log("File uploaded successfully:", response.data);
          // Optionally clear file metadata from Redux after successful import
          setExcelValidateResponse(response.data);
          checkRecord(response.data.countSuccess, response.data.countFail);
        } else {
          console.error("File upload failed:", response);
        }
      } catch (err) {
        console.error("Error uploading file:", err);
      }
    };
    handleUpload();
  }, []);

  const renderQuizAnswers = (rowData) => {
    return (
      <ul>
        {rowData.quizAnswers.map((answer, index) => (
          <li
            key={index}
            className={`${answer.isCorrect ? "font-bold " : "font-medium"}`}
          >
            - {answer.content} (Correct: {answer.isCorrect ? "Yes" : "No"})
          </li>
        ))}
      </ul>
    );
  };
  const renderErrors = (rowData) => {
    return (
      <ul>
        {rowData.errors && rowData.errors.length === 0 ? (
          <li>Hợp Lệ</li>
        ) : (
          rowData.errors &&
          rowData.errors.map((error, index) => (
            <li key={index} className="text-red-600">
              - {error}
            </li>
          ))
        )}
      </ul>
    );
  };
  return (
    <article>
      <p className="pb-2">
        <span className="font-bold mr-28">
          {excelValidateResponse.countSuccess} /{" "}
          {excelValidateResponse.countSuccess + excelValidateResponse.countFail}{" "}
          dòng hợp lệ
        </span>
        <span className="font-bold ">
          {excelValidateResponse.countFail} /{" "}
          {excelValidateResponse.countSuccess + excelValidateResponse.countFail}{" "}
          dòng không hợp lệ
        </span>
      </p>
      <div className="card overflow-auto">
        <DataTable
          value={excelValidateResponse.quizQuestionImportDtos}
          scrollable
          scrollHeight="33rem"
          tableStyle={{ minWidth: "120rem" }}
          className="border-t-2"
        >
          <Column
            field="content"
            header="Câu hỏi"
            frozen
            style={{ width: "200px" }}
            className="font-bold border-b-2 border-t-2"
          ></Column>
          <Column
            field="typeName"
            header="Loại câu hỏi"
            className="border-b-2 border-t-2"
          ></Column>
          <Column
            field="questionLevelName"
            header="Cấp độ câu hỏi"
            className="border-b-2 border-t-2"
          ></Column>
          <Column
            field="quizAnswers"
            header="Quiz Answers"
            body={renderQuizAnswers}
            className="border-b-2 border-t-2"
          ></Column>
          <Column
            field="errors"
            header="Tình trạng"
            body={renderErrors}
            className="border-b-2 border-t-2"
          ></Column>
        </DataTable>
      </div>
    </article>
  );
}

export default ImportStepTwo;
