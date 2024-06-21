import classNames from "classnames";
import { useField } from "formik";

const CustomTextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
      <div className="mb-2">
        <label htmlFor={props.id || props.name}>{label}</label>
        <input
          className={classNames(
            "w-full shadow-none p-1 border",
            { "border-red-500": meta.touched && meta.error },
            { "border-gray-300": !(meta.touched && meta.error) }
          )}
          {...field}
          {...props}
        />
        {meta.touched && meta.error ? (
          <div className="text-red-500">{meta.error}</div>
        ) : null}
      </div>
    );
  };

export default CustomTextInput  