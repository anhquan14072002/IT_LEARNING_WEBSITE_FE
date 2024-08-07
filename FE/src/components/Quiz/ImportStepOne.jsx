import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useContext, useRef, useState } from "react";
import axios from "axios";
import FormDataContext from "../../store/FormDataContext";
import { BASE_URL } from "../../services/restClient";

function ImportStepOne(props) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState();

  const { setData } = useContext(FormDataContext);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = (event) => {
    try {
      const selectedFile = event.target.files[0];
      console.log("Selected file:", selectedFile);

      const formData = new FormData();
      formData.append("fileImport", selectedFile);
      setFile(selectedFile);
      setData(formData, selectedFile); // Set FormData using Context
      // Add your file handling logic here
    } catch (err) {
      console.error(err.message); // the description of the error
    }
  };

  async function exportToExcel() {
    try {
      let res = await axios.get(`${BASE_URL}/api/quizquestion/exportexcel`, {
        params: { checkData: 1 },
        responseType: "arraybuffer", // Important to handle binary data
      });
      console.log(res);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      // Set the href attribute to the Blob URL
      link.href = url;
      let nameExcel = `Quiz-${new Date()
        .toLocaleString()
        .replace(/[\/:]/g, "-")
        .replace(/,/g, "")}.xlsx`;
      // Set the download attribute to specify the file name
      link.setAttribute("download", nameExcel);

      // Append the link to the document
      document.body.appendChild(link);

      // Programmatically click the link to trigger the download
      link.click();

      // Remove the link from the document
      link.remove();
    } catch (err) {
      console.error("Error exporting data:", err);
    }
  }
  return (
    <article className="flex flex-col gap-3">
      <p className="font-medium">
        Chọn dữ liệu Người quản lý nội dung đã chuẩn bị để nhập khẩu vào phần
        mềm
      </p>
      <p className="flex gap-7">
        <InputText
          className="bg-[#ffff] border border-[#c5c7c7] p-1 w-3/5 opacity-100 "
          placeholder="File được chon"
          disabled
          value={file?.name || ""}
        />
        <InputText
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Button
          className="border border-[#c5c7c7] py-1 px-4"
          label="Upload"
          onClick={handleButtonClick}
        />
      </p>
      <p>
        Chưa có tệp mẫu chuẩn bị dữ liệu ? Tải tệp excel mẫu mà phần mềm cung
        cấp để chuẩn bị dữ liệu nhập khẩu
        <a
          href="#"
          className="text-blue-700 font-medium"
          onClick={exportToExcel}
        >
          {" "}
          Tải file excel mẫu
        </a>
      </p>
    </article>
  );
}

export default ImportStepOne;
