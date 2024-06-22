import classNames from "classnames";
import { useField } from "formik";
import { Editor } from "primereact/editor";

const CustomEditor = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);

  const handleChange = (e) => {
    helpers.setValue(e.htmlValue);
  };

  return (
    <div className="mb-2">
      {label && (<label htmlFor={props.id || props.name}>{label}</label>)}
      <div className={classNames(
        "w-full shadow-none border",
        { "border-red-500": meta.touched && meta.error },
        { "border-gray-300": !(meta.touched && meta.error) }
      )}>
        <Editor
          id={props.id || props.name}
          value={field.value}
          onTextChange={handleChange}
          className="w-full"
          style={{ height: '300px' }}
          {...props}
        />
      </div>
      {meta.touched && meta.error ? (
        <div className="text-red-500">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default CustomEditor  