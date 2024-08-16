import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import { Button } from "primereact/button";
import React, { useRef, useState, useEffect } from "react";
import { isLoggedIn } from "../../utils";
import { useNavigate } from "react-router-dom";
import AddSolution from "../AddSolution";
import { Toast } from "primereact/toast";
import { useSelector } from "react-redux";
import { Paginator } from "primereact/paginator";
import restClient from "../../services/restClient";

export default function CommentCoding({ id }) {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [isVisibleAdd, setIsVisibleAdd] = useState(false);
  const [solutions, setSolutions] = useState([]);
  const [isVisibleUpdate, setIsVisibleUpdate] = useState(false); // Add functionality for update if needed

  // Pagination
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(5);
  const [totalPage, setTotalPage] = useState(0);

  const fetchSolutions = async () => {
    const pageSize = rows || 10;
    restClient({
      url: `api/solution/getallsolutionbyproblemidpagination?ProblemId=${id}&PageIndex=${page}&PageSize=${pageSize}`,
    })
      .then((response) => {
        if (response.data.isSucceeded) {
          const paginationData = JSON.parse(response.headers["x-pagination"]);
          setTotalPage(paginationData.TotalPages);
          setSolutions(response.data.data);
        }
      })
      .catch((err) => {
        setSolutions([]);
      });
  };

  useEffect(() => {
    console.log('====================================');
    console.log("run solution");
    console.log('====================================');
    fetchSolutions();
  }, [id, page, rows]);

  const onPageChange = (event) => {
    const { page, rows, first } = event;
    setRows(rows);
    setPage(page + 1);
    setFirst(first);
  };

  return (
    <div>
      <Toast ref={toast} />
      <AddSolution
        visible={isVisibleAdd}
        setVisible={setIsVisibleAdd}
        toast={toast}
        id={id}
        fetchSolutions={fetchSolutions}
      />
      <div>
        {isLoggedIn() ? (
          <Button
            className="pi pi-plus bg-green-600 p-2 rounded-lg text-white hover:bg-green-400"
            onClick={() => setIsVisibleAdd(true)}
          >
            Thêm lời giải
          </Button>
        ) : (
          <Button
            className="bg-green-600 p-2 rounded-lg text-white hover:bg-green-400"
            onClick={() => navigate("/login")}
          >
            Vui lòng đăng nhập để có thể thêm lời giải
          </Button>
        )}
      </div>
      <div>
        <h2>Danh sách lời giải</h2>
        {solutions.length > 0 ? (
          <>
            <ul>
              {solutions.map((solution) => (
                <li
                  key={solution.id}
                  className="mb-4 p-4 border border-gray-300 rounded-lg"
                >
                  <div className="flex gap-5 flex-wrap mb-5">
                    <div>
                      <img
                        src={solution.image}
                        alt={solution.fullName}
                        className="w-16 h-16 rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">{solution.title}</h3>
                    </div>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: solution.description,
                    }}
                  />
                  <pre>
                    <CodeMirror
                      className=""
                      value={atob(solution.coding)}
                      options={{
                        theme: "material",
                        lineNumbers: true,
                      }}
                    />
                  </pre>
                </li>
              ))}
            </ul>
            <Paginator
              first={first}
              rows={rows}
              totalRecords={totalPage * rows} // Total records should be calculated based on total pages and rows per page
              onPageChange={onPageChange}
              className="custom-paginator mx-auto"
            />
          </>
        ) : (
          <p>Chưa có lời giải nào</p>
        )}
      </div>
    </div>
  );
}
