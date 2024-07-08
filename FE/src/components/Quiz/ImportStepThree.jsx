import React, { useContext } from "react";
import FormDataContext from "../../store/FormDataContext";

function ImportStepThree(props) {
  const { success, fail } = useContext(FormDataContext);
  return (
    <article>
      <div className="flex flex-col gap-3">
        <h1 className="font-bold text-2xl">Kết quả nhập khẩu</h1>
        <p>
          Tải về tập tin chứa kết quả nhập khẩu
          <a href="#" className="text-blue-700 font-medium">
            {" "}
            Tại đây
          </a>
        </p>
        <ul className="ml-5">
          <li> + Số dòng nhập khẩu thành công: {success}</li>
          <li> + Số dòng nhập khẩu không thành công: {fail}</li>
        </ul>
      </div>
    </article>
  );
}

export default ImportStepThree;
