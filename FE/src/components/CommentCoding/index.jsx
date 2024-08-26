import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import { Button } from "primereact/button";
import React, { useRef, useState, useEffect } from "react";
import { isLoggedIn, REJECT, SUCCESS } from "../../utils";
import { useNavigate } from "react-router-dom";
import AddSolution from "../AddSolution";
import { Toast } from "primereact/toast";
import { Paginator } from "primereact/paginator";
import restClient from "../../services/restClient";
import { Tooltip } from "primereact/tooltip";
import { useSelector } from "react-redux";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import UpdateSolution from "../UpdateSolution";

export default function CommentCoding({ id }) {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [isVisibleAdd, setIsVisibleAdd] = useState(false);
  const [solutions, setSolutions] = useState([]);
  const user = useSelector((state) => state.user.value);
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [updateValue, setUpdateValue] = useState({});

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

  const fetchSolutionsAfterDelete = async () => {
    const pageSize = rows || 10;
    setPage(1);
    restClient({
      url: `api/solution/getallsolutionbyproblemidpagination?ProblemId=${id}&PageIndex=1&PageSize=${pageSize}`,
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
    console.log("====================================");
    console.log("run solution");
    console.log("====================================");
    fetchSolutions();
  }, [id, page, rows]);

  const onPageChange = (event) => {
    const { page, rows, first } = event;
    setRows(rows);
    setPage(page + 1);
    setFirst(first);
  };

  const handleDeleteSolution = (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this solution?"
    );

    if (isConfirmed) {
      restClient({ url: `api/solution/deletesolution/${id}`, method: "DELETE" })
        .then((res) => {
          SUCCESS(toast, "Xóa thành công !!!");
          fetchSolutionsAfterDelete();
        })
        .catch((err) => {
          REJECT(toast, "Xóa không thành công !!!");
        });
    }
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
      <UpdateSolution
        visible={visibleUpdate}
        setVisible={setVisibleUpdate}
        toast={toast}
        id={id}
        fetchSolutions={fetchSolutions}
        updateValue={updateValue}
      />
      <div className="mb-4">
        {isLoggedIn() ? (
          <Button
            className="pi pi-plus bg-green-600 p-2 rounded-lg text-white hover:bg-green-400"
            onClick={() => setIsVisibleAdd(true)}
          >
            Thêm bình luận
          </Button>
        ) : (
          <Button
            className="bg-green-600 p-2 rounded-lg text-white hover:bg-green-400"
            onClick={() => navigate("/login")}
          >
            Vui lòng đăng nhập để có thể thêm bình luận
          </Button>
        )}
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Danh sách bình luận</h2>
        {solutions.length > 0 ? (
          <>
            <ul>
              {solutions.map((solution) => (
                <li
                  key={solution.id}
                  className="mb-4 p-4 border border-gray-300 rounded-lg overflow-hidden"
                >
                  <div className="flex gap-5 flex-wrap mb-5">
                    <div className="flex-shrink-0">
                      <Tooltip
                        target=".my-tooltip"
                        content={solution?.fullName}
                      />
                      <img
                        src={solution?.image}
                        alt={solution?.fullName}
                        className="w-16 h-16 rounded-full my-tooltip object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 w-full max-w-md">
                      <h3 className="font-bold text-xl break-words">
                        {solution.title}
                      </h3>
                    </div>
                  </div>
                  <div
                    className="w-full break-words"
                    dangerouslySetInnerHTML={{
                      __html: solution.description,
                    }}
                  />
                  <pre className="mt-4">
                    <CodeMirror
                      value={atob(solution.coding)}
                      options={{
                        theme: "material",
                        lineNumbers: true,
                      }}
                    />
                  </pre>
                  {isLoggedIn() && user?.sub === solution?.userId && (
                    <div className="mt-3 flex justify-end gap-2 flex-wrap">
                      <button
                        className="p-2 cursor-pointer rounded-md bg-blue-600 hover:bg-blue-400 text-white"
                        onClick={() => {
                          setUpdateValue(solution);
                          setVisibleUpdate(true);
                        }}
                      >
                        Cập nhật
                      </button>
                      <button
                        className="p-2 cursor-pointer rounded-md bg-red-600 hover:bg-red-400 text-white"
                        onClick={() => handleDeleteSolution(solution?.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <Paginator
              first={first}
              rows={rows}
              totalRecords={totalPage * rows}
              onPageChange={onPageChange}
              className="custom-paginator mx-auto"
            />
          </>
        ) : (
          <p>Chưa có bình luận nào</p>
        )}
      </div>
    </div>
  );
}
