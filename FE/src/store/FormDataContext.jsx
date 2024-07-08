// FormDataContext.js
import React, { createContext, useState } from "react";

const FormDataContext = createContext();

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState(null);
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(0);
  const [fail, setFail] = useState(0);

  function setData(formData, file) {
    setFile(file);
    setFormData(formData);
  }
  function checkRecord(success, fail) {
    setSuccess(success);
    setFail(fail);
  }
  return (
    <FormDataContext.Provider
      value={{ formData, file, setData, success, fail, checkRecord }}
    >
      {children}
    </FormDataContext.Provider>
  );
};

export default FormDataContext;
