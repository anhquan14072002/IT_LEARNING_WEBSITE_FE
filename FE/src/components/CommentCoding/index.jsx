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
import axios from "axios"; // Use axios or fetch for making API requests

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
    try {
      const pageIndex = page || 1;
      const pageSize = rows || 10;
      const response = await axios.get(
        `http://localhost:8000/api/solution/getallsolutionbyproblemidpagination?ProblemId=${id}&PageIndex=${pageIndex}&PageSize=${pageSize}`
      );
      if (response.data.isSucceeded) {
        const paginationData = JSON.parse(response.headers["x-pagination"]);
        setTotalPage(paginationData.TotalPages);
        setSolutions(response.data.data);
      } else {
        // Handle error if needed
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error fetching solutions:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch solutions.",
      });
    }
  };

  useEffect(() => {
    

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
          <p>No solutions found.</p>
        )}
      </div>
    </div>
  );
}
