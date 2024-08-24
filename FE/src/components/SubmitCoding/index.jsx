import React, { useEffect, useState } from "react";
import restClient from "../../services/restClient";
import { useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function SubmitCoding({ id }) {
  const [submitCode, setSubmitCode] = useState([]);
  const user = useSelector((state) => state.user.value);
  const indexBodyTemplate = (rowData, { rowIndex }) => {
    return <span>{rowIndex}</span>;
  };
  const exec = (rowData, { rowIndex }) => {
    return <span>{rowData?.executionTime}s</span>;
  };
  const execC = (rowData, { rowIndex }) => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString(); // Formats the date to a readable format
    };

    return (
      <span>{rowData?.createdDate ? formatDate(rowData.createdDate) : ""}</span>
    );
  };

  const status = (rowData, { rowIndex }) => {
    return <span>{rowData?.status === "Accepted" ? "Passed" :rowData?.status}</span>
  }

  useEffect(() => {
    restClient({
      url: `api/submission/getallsubmission?ProblemId=${id}&UserId=${user.sub}`,
    })
      .then((res) => {
        setSubmitCode(res?.data?.data);
      })
      .catch((err) => {
        setSubmitCode([]);
      });
  }, [id]);

  return (
    <div>
      <DataTable
        value={submitCode}
        className="border-2"
        tableStyle={{ minHeight: "10rem" }}
        scrollable
        scrollHeight="20rem"
      >
        <Column
          field="#"
          header="#"
          body={indexBodyTemplate}
          className="border-b-2 border-t-2"
          style={{ minWidth: "5rem" }}
        />

        <Column
          header="Trạng thái"
          className="border-b-2 border-t-2"
          style={{ minWidth: "15rem" }}
          body={status}
        />

        <Column
          field="languageName"
          header="Ngôn ngữ"
          className="border-b-2 border-t-2"
          style={{ minWidth: "15rem" }}
        />

        <Column
          header="Thời gian thực hiện"
          className="border-b-2 border-t-2"
          style={{ minWidth: "15rem" }}
          body={exec}
        />
        <Column
          header="Thời gian nộp bài"
          className="border-b-2 border-t-2"
          style={{ minWidth: "20rem" }}
          body={execC}
        />
      </DataTable>
    </div>
  );
}
