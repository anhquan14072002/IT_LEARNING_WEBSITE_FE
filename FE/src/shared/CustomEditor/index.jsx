import classNames from "classnames";
import { useField } from "formik";
import { Editor } from "primereact/editor";
import { useState } from "react";

const CustomEditor = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);
  const [focus, setFocus] = useState(false);

  const handleChange = (e) => {
    helpers.setValue(e.htmlValue);
  };

  return (
    <div className="mb-5">
      {label && <label htmlFor={props.id || props.name}>{label}</label>}
      <div
        className={classNames(
          "w-full shadow-none border rounded-md",
          { "border-black": focus },
          { "border-red-500": meta.touched && meta.error },
          { "border-gray-300": !(meta.touched && meta.error) }
        )}
      >
        <Editor
          id={props.id || props.name}
          value={field.value}
          onTextChange={handleChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className="w-full"
          style={{ height: "300px" }}
          {...props}
        />
      </div>
      {meta.touched && meta.error && (
        <div className="text-red-500">{meta.error}</div>
      )}
    </div>
  );
};

export default CustomEditor;
