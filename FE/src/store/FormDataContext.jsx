// FormDataContext.js
import React, { createContext, useState } from "react";

const FormDataContext = createContext();

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState(null);
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(0);
  const [fail, setFail] = useState(0);
  const [quizId, setQuizId] = useState(1);
  const [idImport, setIdImport] = useState("");
  const [idImportFail, setIdImportFail] = useState("");
  const [idImportResult, setIdImportResult] = useState("");
  const [step, setStep] = useState("");

  function setData(formData, file) {
    setFile(file);
    setFormData(formData);
  }
  function checkRecord(
    success,
    fail,
    idImport,
    idImportFail,
    idImportResult,
    quizId
  ) {
    setSuccess(success);
    setFail(fail);
    setIdImport(idImport);
    setIdImportFail(idImportFail);
    setIdImportResult(idImportResult);
    setQuizId(quizId);
  }
  return (
    <FormDataContext.Provider
      value={{
        formData,
        file,
        setData,
        step,
        idImport,
        idImportFail,
        idImportResult,
        success,
        fail,
        checkRecord,
        setStep,
        quizId,
      }}
    >
      {children}
    </FormDataContext.Provider>
  );
};

export default FormDataContext;
