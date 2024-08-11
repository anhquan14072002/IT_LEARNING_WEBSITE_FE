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
  const exec = (rowData, { rowIndex }) =>{
    return <span>{rowData?.executionTime}s</span>;
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
          style={{ width: "5%" }}
        />

        <Column
          field="status"
          header="Trạng thái"
          className="border-b-2 border-t-2"
          style={{ width: "15%" }}
        />

        <Column
          header="Thời gian thực hiện"
          className="border-b-2 border-t-2"
          style={{ width: "15%" }}
          body={exec}
        />
      </DataTable>
    </div>
  );
}
