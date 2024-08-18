import debounce from "lodash.debounce";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import React, { useContext, useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import restClient from "../../services/restClient";
import Loading from "../../components/Loading";
import {
  ACCEPT,
  formatDate,
  getTokenFromLocalStorage,
  REJECT,
} from "../../utils";
import { InputSwitch } from "primereact/inputswitch";
import AddQuizLesson from "../../components/AddQuizLesson";
import UpdateQuizLesson from "../../components/UpdateQuizLesson";
import AddQuestion from "../../components/AddQuestion";
import UpdateQuestion from "../../components/UpdateQuestion";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { Tooltip } from "primereact/tooltip";
import ImportFromQuiz from "../../components/ImportFromQuiz";
import NotifyProvider from "../../store/NotificationContext";
import FormDataContext, { FormDataProvider } from "../../store/FormDataContext";
import { useSelector } from "react-redux";

export default function ManageQuestionOfQuizlist() {
  const toast = useRef(null);
  const dropDownRef1 = useRef(null);
  const dropDownRef2 = useRef(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const cm = useRef(null);
  const [visible, setVisible] = useState(false);
  const [visibleImport, setVisibleImport] = useState(false);
  const [updateValue, setUpdateValue] = useState({});
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textSearch, setTextSearch] = useState("");
  const { id } = useParams();
  const user = useSelector((state) => state.user.value);
  //pagination
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalPage, setTotalPage] = useState(0);

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const Menus = [
    // Admin specific menus
    ...(user.role === "Admin"
      ? [
          {
            title: "Thống kê",
          
            icon: "pi pi-chart-bar",
            index: "statistic",
          },
          {
            title: "Quản lí tài khoản",
        
            icon: "pi pi-user",
            index: "user",
          },

          {
            title: "Quản lí tài liệu/chủ đề/bài học",
       
            icon: "pi pi-book",
            index: "adminManageDocument",
          },
        ]
      : []),

    // Content Manager specific menus
    ...(user.role === "ContentManager"
      ? [
          {
            title: "Quản lí bài học",
      
            icon: "pi pi-book",
            index: "lesson",
          },
        ]
      : []),

    // Common menus
    {
      title: "Quản lí câu hỏi ôn tập",

      icon: "pi pi-question-circle",
      index: "quiz",
    },
    {
      title: "Quản lí đề thi",

      icon: "pi pi-file",
      index: "test",
    },
    {
      title: "Quản lí tag",

      icon: "pi pi-tag",
      index: "tag",
    },
    {
      title: "Quản lí bài thực hành",
      icon: "pi pi-ticket",
      index: "codeeditor",
    },
  ];

  useEffect(() => {
    fetchData();
  }, [page, rows, textSearch]);

  const pagination = (page, rows) => {
    setLoading(true);

    restClient({
      url: `api/quizquestion/getallquizquestionpagination?QuizId=${id}&PageIndex=${page}&PageSize=${rows}`,
      method: "GET",
    })
      .then((res) => {
        const paginationData = JSON.parse(res.headers["x-pagination"]);
        setTotalPage(paginationData.TotalPages);
        setProducts(Array.isArray(res.data.data) ? res.data.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setProducts([]);
        setLoading(false);
      });
  };

  const fetchData = () => {
    // if (textSearch.trim()) {
    //   setLoading(true);
    //   restClient({
    //     url: `api/topic/searchbytopicpagination?Value=${textSearch}&PageIndex=${page}&PageSize=${rows}`,
    //     method: "GET",
    //   })
    //     .then((res) => {
    //       const paginationData = JSON.parse(res.headers["x-pagination"]);
    //       setTotalPage(paginationData.TotalPages);
    //       setProducts(Array.isArray(res.data.data) ? res.data.data : []);
    //     })
    //     .catch((err) => {
    //       console.error("Error fetching data:", err);
    //       setProducts([]);
    //     })
    //     .finally(() => setLoading(false));
    // } else {
    pagination(page, rows);
    // }
  };

  const onPageChange = (event) => {
    const { page, rows, first } = event;
    setRows(rows);
    setPage(page + 1);
    setFirst(first);
  };

  const indexBodyTemplate = (rowData, { rowIndex }) => {
    const index = (page - 1) * rows + (rowIndex + 1);
    return <span>{index}</span>;
  };

  const content = (rowData, { rowIndex }) => {
    return <span dangerouslySetInnerHTML={{ __html: rowData?.content }}></span>;
  };

  const cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

  const actionBodyTemplate = (rowData) => {
    return (
      <div style={{ display: "flex" }}>
        <Button
          icon="pi pi-pencil"
          className="text-blue-600 p-mr-2 shadow-none"
          onClick={() => {
            setUpdateValue(rowData);
            setVisibleUpdate(true);
          }}
        />
        <Button
          icon="pi pi-trash"
          className="text-red-600 shadow-none"
          onClick={() => {
            confirmDelete(rowData.id);
          }}
        />
      </div>
    );
  };

  const confirmDelete = (id) => {
    setVisibleDelete(true);
    confirmDialog({
      message: "Bạn có chắc chắn muốn bài quiz này?",
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
            }}
          />
          <Button
            label="Xóa"
            icon="pi pi-check"
            className="p-2 bg-blue-500 text-white"
            onClick={() => {
              deleteDocument(id);
            }}
          />
        </>
      ),
    });
  };

  const deleteDocument = (id) => {
    restClient({
      url: `api/quizquestion/deletequizquestion/${id}`,
      method: "DELETE",
    })
      .then((res) => {
        fetchData();
        ACCEPT(toast, "Xóa thành công");
      })
      .catch((err) => {
        REJECT(toast, "Xảy ra lỗi khi xóa câu hỏi này");
      })
      .finally(() => {
        setVisibleDelete(false);
      });
  };

  const handleSearchInput = debounce((text) => {
    setTextSearch(text);
  }, 300);

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

  return (
    <NotifyProvider>
      <div className="fixed top-0 w-full z-30">
        <Header />
      </div>
      <div className="fixed left-0 top-16 z-20">
        <div
          className={`${
            open ? "w-72" : "w-20"
          } bg-dark-purple h-screen p-5 pt-8 duration-300`}
        >
            <i
                className={`pi pi-arrow-circle-right text-white text-xl  absolute cursor-pointer right-2 top-7 w-7 
   rounded-full ${!open ? "rotate-180" : ""}`}
                onClick={() => setOpen(!open)}
              />

          <ul className="pt-6">
            {Menus.map((Menu) => (
              <li
                key={Menu.index}
                className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-2`}
                onClick={() => {
                  navigate(`/dashboard/${Menu.index}`);
                }}
              >
               <Tooltip
                      target={`#tooltip-${Menu.index}`}
                      content={Menu.title}
                    />
                    <i id={`tooltip-${Menu.index}`} className={Menu.icon}></i>
                <span
                  className={`${
                    !open ? "hidden" : ""
                  } origin-left duration-200`}
                >
                  {Menu.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="ml-20 mt-16 p-7">
        <div className="h-screen">
          <div>
            <Toast ref={toast} />
            <ConfirmDialog visible={visibleDelete} />
            {/* <ImportFromQuiz
              visible={visibleImport}
              setVisible={setVisibleImport}
              toast={toast}
              fetchData={fetchData}
              id={id}
            /> */}
            <AddQuestion
              id={id}
              visible={visible}
              setVisible={setVisible}
              toast={toast}
              fetchData={fetchData}
            />
            <UpdateQuestion
              visibleUpdate={visibleUpdate}
              setVisibleUpdate={setVisibleUpdate}
              updateValue={updateValue}
              toast={toast}
              fetchData={fetchData}
            />
            <div>
              <div className="flex justify-between pt-1">
                <h1 className="font-bold text-3xl">Câu hỏi quiz</h1>
                <div className="flex gap-5">
                  <Button
                    label="Import câu hỏi"
                    icon="pi pi-plus-circle"
                    severity="info"
                    className="bg-blue-600 text-white p-2 text-sm font-normal"
                    onClick={() => navigate(`/importQuiz/stepOne/${id}`)}
                  />
                  <Button
                    label="Soạn câu hỏi mới"
                    icon="pi pi-plus-circle"
                    severity="info"
                    className="bg-blue-600 text-white p-2 text-sm font-normal"
                    onClick={() => setVisible(true)}
                  />
                  {/* <Button
              label="Xóa"
              icon="pi pi-trash"
              disabled={!selectedProduct || selectedProduct.length === 0}
              severity="danger"
              className="bg-red-600 text-white p-2 text-sm font-normal ml-3"
              onClick={() => {
                console.log("product list ::", selectedProduct);
              }}
            /> */}
                </div>
              </div>

              <div className="border-2 rounded-md mt-2">
                <div className="mb-10 flex flex-wrap items-center p-2">
                  <div className="border-2 rounded-md p-2">
                    <InputText
                      onChange={(e) => {
                        handleSearchInput(
                          removeVietnameseTones(e.target.value)
                        );
                      }}
                      placeholder="Search"
                      className="flex-1 focus:outline-none w-36 focus:ring-0"
                    />
                    <Button
                      icon="pi pi-search"
                      className="p-button-warning focus:outline-none focus:ring-0 flex-shrink-0"
                    />
                  </div>

                  <div className="flex-1 flex flex-wrap gap-3 justify-end">
                    <div className="border-2 rounded-md mt-4">
                      <Dropdown
                        filter
                        ref={dropDownRef2}
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.value)}
                        options={cities}
                        optionLabel="name"
                        showClear
                        placeholder="Tài liệu"
                        className="w-full md:w-14rem shadow-none h-full"
                      />
                    </div>
                  </div>
                </div>
                {loading ? (
                  <Loading />
                ) : (
                  <>
                    <DataTable
                      value={products}
                      loading={loading}
                      className="border-t-2"
                      tableStyle={{ minHeight: "30rem" }}
                      selection={selectedProduct}
                      onSelectionChange={(e) => setSelectedProduct(e.value)}
                      scrollable
                      scrollHeight="30rem"
                    >
                      {/* <Column
                  selectionMode="multiple"
                  headerStyle={{ width: "3rem" }}
                  className="border-b-2 border-t-2 custom-checkbox-column"
                ></Column> */}
                      <Column
                        field="#"
                        header="#"
                        body={indexBodyTemplate}
                        className="border-b-2 border-t-2"
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
                        field="score"
                        header="Điểm"
                        className="border-b-2 border-t-2"
                        style={{ width: "15%" }}
                      />
                      <Column
                        header="Trạng thái"
                        className="border-b-2 border-t-2"
                        body={status}
                        style={{ minWidth: "15rem" }}
                      ></Column>
                      {/* <Column
                  field="createdDate"
                  header="Ngày tạo"
                  className="border-b-2 border-t-2"
                  style={{ width: "10%" }}
                  body={(rowData) => formatDate(rowData.createdDate)}
                />
                <Column
                  field="lastModifiedDate"
                  header="Ngày cập nhật"
                  className="border-b-2 border-t-2"
                  style={{ width: "10%" }}
                  body={(rowData) => formatDate(rowData.lastModifiedDate)}
                /> */}
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </NotifyProvider>
  );
}
