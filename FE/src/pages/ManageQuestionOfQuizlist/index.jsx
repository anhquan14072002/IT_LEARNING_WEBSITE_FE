import { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import Footer from "../../components/Footer";
import restClient from "../../services/restClient";
import { useNavigate, useParams } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import { Column } from "primereact/column";
import debounce from "lodash.debounce";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import {
  ACCEPT,
  REJECT,
  decodeIfNeeded,
  formatDate,
  getTokenFromLocalStorage,
  removeVietnameseTones,
} from "../../utils/index";

export default function ManageQuestionOfQuizlist() {
  const fixedDivRef = useRef(null);
  const toast = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const { id } = useParams();
  const [questionList, setQuestionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [textSearch, setTextSearch] = useState("");
  const [visibleDelete, setVisibleDelete] = useState(false);
  const navigate = useNavigate();

  // Pagination
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalPage, setTotalPage] = useState(0);

  const updateFixedDivHeight = () => {
    if (fixedDivRef.current) {
      setFixedDivHeight(fixedDivRef.current.offsetHeight);
    }
  };

  const pagination = (page, rows) => {
    setLoading(true);
    restClient({
      url: `api/quizquestion/searchquizquestionpagination?PageIndex=${page}&PageSize=${rows}&QuizId=${id}`,
      method: "GET",
    })
      .then((res) => {
        const paginationData = JSON.parse(res.headers["x-pagination"]);
        setTotalPage(paginationData.TotalPages);
        setQuestionList(Array.isArray(res.data.data) ? res.data.data : []);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setQuestionList([]);
      })
      .finally(() => setLoading(false));
  };

  const confirmDeleteMany = () => {
    setVisibleDelete(true);
    confirmDialog({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      footer: (
        <>
          <Button
            label="Hủy"
            icon="pi pi-times"
            className="p-2 bg-red-500 text-white mr-2"
            onClick={() => {
              setVisibleDelete(false);
              REJECT(toast);
            }}
          />
          <Button
            label="Xóa"
            icon="pi pi-check"
            className="p-2 bg-blue-500 text-white"
            onClick={handleDeleteMany}
          />
        </>
      ),
    });
  };

  const fetchData = () => {
    if (textSearch.trim()) {
      setLoading(true);
      restClient({
        url: `api/quizquestion/searchquizquestionpagination?QuizId=${id}&Value=${textSearch}&PageIndex=${page}&PageSize=${rows}&QuizId=${id}`,
        method: "GET",
      })
        .then((res) => {
          const paginationData = JSON.parse(res.headers["x-pagination"]);
          setTotalPage(paginationData.TotalPages);
          setQuestionList(Array.isArray(res.data.data) ? res.data.data : []);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setQuestionList([]);
        })
        .finally(() => setLoading(false));
    } else {
      pagination(page, rows);
    }
  };

  useEffect(() => {
    updateFixedDivHeight();

    window.addEventListener("resize", updateFixedDivHeight);

    return () => {
      window.removeEventListener("resize", updateFixedDivHeight);
    };
  }, []);

  const indexBodyTemplate = (rowData, { rowIndex }) => {
    const index = (page - 1) * rows + (rowIndex + 1);
    return <span>{index}</span>;
  };

  const handleSearchInput = debounce((text) => {
    setTextSearch(text);
  }, 300);

  const onPageChange = (event) => {
    const { page, rows, first } = event;
    setRows(rows);
    setPage(page + 1);
    setFirst(first);
  };

  const content = (rowData, { rowIndex }) => {
    return <span dangerouslySetInnerHTML={{ __html: rowData?.content }}></span>;
  };

  const changeStatusLesson = (value, id) => {
    restClient({
      url: "api/quizquestion/updatestatusquizquestion?id=" + id,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getTokenFromLocalStorage()}`,
      },
    })
      .then((res) => {
        ACCEPT(toast, "Thay đổi trạng thái thành công");
        fetchData();
      })
      .catch((err) => {
        REJECT(toast, "Lỗi khi thay đổi trạng thái");
      });
  };

  const status = (rowData, { rowIndex }) => {
    return (
      <InputSwitch
        checked={rowData?.isActive}
        onChange={(e) => changeStatusLesson(e.value, rowData.id)}
        tooltip={rowData.isActive ? "Đã được duyệt" : "Chưa được duyệt"}
      />
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div style={{ display: "flex" }}>
        <Button
          icon="pi pi-trash"
          className="text-red-600 shadow-none"
          onClick={() => {
            setVisibleDelete(true);
            confirm(rowData.id);
          }}
        />
      </div>
    );
  };

  const handleDeleteMany = () => {
    setLoadingDeleteMany(true);
    const arrayId = selectedProduct.map((p, index) => p.id);
    restClient({
      url: `api/lesson/deleterangelesson`,
      method: "DELETE",
      data: arrayId,
    })
      .then((res) => {
        ACCEPT(toast, "Xóa thành công");
        setSelectedProduct([]);
        getData();
      })
      .catch((err) => {
        REJECT(toast, "Xảy ra lỗi khi xóa");
      })
      .finally(() => {
        setLoadingDeleteMany(false);
        setVisibleDelete(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [page, rows, textSearch]);

  return (
    <div className="min-h-screen flex flex-col gap-5">
      <div ref={fixedDivRef} className="fixed top-0 w-full z-50">
        <Header />
        <Menu />
      </div>

      <div style={{ paddingTop: `${fixedDivHeight}px` }}>
        <ConfirmDialog visible={visibleDelete} />
        <Toast ref={toast} />
        <div className="border-2 rounded-md mt-2">
          <div className="mb-10 flex flex-wrap justify-between items-center p-2">
            <div className="border-2 rounded-md p-2">
              <InputText
                onChange={(e) => {
                  handleSearchInput(removeVietnameseTones(e.target.value));
                }}
                placeholder="Search"
                className="flex-1 focus:outline-none w-36 focus:ring-0"
              />
              <Button
                icon="pi pi-search"
                className="p-button-warning focus:outline-none focus:ring-0 flex-shrink-0"
              />
            </div>
            <div>
              <Button
                label="Thêm câu hỏi"
                icon="pi pi-plus-circle"
                severity="info"
                className="bg-blue-600 text-white p-2 text-sm font-normal"
                onClick={() =>
                  navigate("/dashboard/quiz/addquestionofquizlist/" + id)
                }
              />
              <Button
                label="Xóa"
                icon="pi pi-trash"
                severity="danger"
                disabled={!selectedQuestion || selectedQuestion?.length === 0}
                className="bg-red-600 text-white p-2 text-sm font-normal ml-3"
                onClick={confirmDeleteMany}
              />
            </div>
          </div>

          <DataTable
            value={questionList}
            loading={loading}
            className="border-t-2"
            tableStyle={{ minHeight: "40rem" }}
            selection={selectedQuestion}
            onSelectionChange={(e) => setSelectedQuestion(e.value)}
            scrollable
            scrollHeight="50rem"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3rem" }}
              className="border-b-2 border-t-2 custom-checkbox-column"
            ></Column>
            <Column
              field="#"
              header="#"
              body={indexBodyTemplate}
              className="border-b-2 border-t-2"
              style={{ minWidth: "5rem" }}
            />
            <Column
              header="Nội dung"
              className="border-b-2 border-t-2"
              style={{ minWidth: "35rem" }}
              body={content}
            />
            <Column
              field="type"
              header="Loại câu hỏi"
              className="border-b-2 border-t-2"
              style={{ minWidth: "15rem" }}
            />
            <Column
              field="questionLevel"
              header="Mức độ"
              className="border-b-2 border-t-2"
              style={{ minWidth: "15rem" }}
            />
            <Column
              header="Trạng thái"
              className="border-b-2 border-t-2"
              body={status}
              style={{ minWidth: "15rem" }}
            ></Column>
            <Column
              className="border-b-2 border-t-2"
              body={actionBodyTemplate}
              style={{ minWidth: "15rem" }}
            />
          </DataTable>
          <Paginator
            first={first}
            rows={rows}
            rowsPerPageOptions={[10, 20, 30]}
            totalRecords={totalPage * rows}
            onPageChange={onPageChange}
            className="custom-paginator mx-auto"
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
