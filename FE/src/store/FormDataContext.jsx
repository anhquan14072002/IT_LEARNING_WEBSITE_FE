// FormDataContext.js
import React, { createContext, useState } from "react";

const FormDataContext = createContext();

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState(null);
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(0);
  const [fail, setFail] = useState(0);
  const [idImport, setIdImport] = useState("");

  function setData(formData, file) {
    setFile(file);
    setFormData(formData);
  }
  function checkRecord(success, fail, idImport) {
    setSuccess(success);
    setFail(fail);
    setIdImport(idImport);
  }
  return (
    <FormDataContext.Provider
      value={{ formData, file, setData, idImport, success, fail, checkRecord }}
    >
      {children}
    </FormDataContext.Provider>
  );
};

export default FormDataContext;
