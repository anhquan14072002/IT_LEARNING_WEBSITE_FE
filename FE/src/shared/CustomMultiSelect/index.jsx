import React, { useEffect, useState } from "react";
import { useField } from "formik";
import classNames from "classnames";
import "./index.css";
import { MultiSelect } from "primereact/multiselect";

const CustomMultiSelect = ({
  label,
  options,
  isClear,
  clearGrade,
  setClearGrade,
  handleOnChange,
  title,
  ...props
}) => {
  const [field, meta, helpers] = useField(props);
  const [touchedState, setTouchedState] = useState(false); // State to manage touched state manually

  useEffect(() => {
    if (clearGrade) {
      handleClear();
      setClearGrade(false);
    }
  }, [clearGrade, handleClear, setClearGrade]);

  const handleBlur = () => {
    helpers.setTouched(true); // Manually set Formik touched state
    setTouchedState(true); // Set touched state to true on blur
  };

  const handleClear = () => {
    helpers.setValue([]); // Clear the field value to an empty array
    setTouchedState(true); // Optionally set touched state to true after clearing 
  };

  return (
    <div className="mb-5 flex-1">
      <label htmlFor={props.id || props.name}>{label}</label>
      <MultiSelect
        value={field.value || []} // Control the value prop with Formik's field value
        {...props}
        options={options}
        onChange={(e) => {
          handleOnChange(e, helpers, setTouchedState, props);
        }}
        onBlur={handleBlur} // Handle onBlur to set touched state manually
        showClear={isClear}
        onClear={handleClear}
        optionLabel="title"
        filter
        placeholder={title}
        className={classNames("w-full shadow-none p-1 border", {
          "border-red-500": meta.error && (meta.touched || touchedState),
          "border-gray-300": !meta.error || !(meta.touched || touchedState),
        })}
      />
      {meta.error && (meta.touched || touchedState) && (
        <div className="text-red-500">{meta.error}</div>
      )}
    </div>
  );
};

export default CustomMultiSelect;
