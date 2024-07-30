import debounce from "lodash.debounce";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import restClient from "../../services/restClient";
import {
  ACCEPT,
  formatDate,
  getTokenFromLocalStorage,
  REJECT,
  removeVietnameseTones,
} from "../../utils";
import { InputSwitch } from "primereact/inputswitch";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import Footer from "../../components/Footer";
import { useNavigate, useParams } from "react-router-dom";

export default function AddQuestionOfQuizlist() {
  const {id} = useParams()
  const fixedDivRef = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const toast = useRef(null);
  const dropDownRef1 = useRef(null);
  const dropDownRef2 = useRef(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const cm = useRef(null);
  const [visible, setVisible] = useState(false);
  const [updateValue, setUpdateValue] = useState({});
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textSearch, setTextSearch] = useState("");
  const navigate = useNavigate()

  //pagination
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    fetchData();
  }, [page, rows, textSearch]);

  const pagination = (page, rows) => {
    setLoading(true);

    restClient({
      url: `api/quizquestion/getallquizquestionpagination?PageIndex=${page}&PageSize=${rows}`,
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
    if (textSearch.trim()) {
      setLoading(true);
      restClient({
        url: `api/quizquestion/searchquizquestionpagination?Value=${textSearch}&PageIndex=${page}&PageSize=${rows}`,
        method: "GET",
      })
        .then((res) => {
          const paginationData = JSON.parse(res.headers["x-pagination"]);
          setTotalPage(paginationData.TotalPages);
          setProducts(Array.isArray(res.data.data) ? res.data.data : []);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setProducts([]);
        })
        .finally(() => setLoading(false));
    } else {
      pagination(page, rows);
    }
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

  const updateFixedDivHeight = () => {
    if (fixedDivRef && fixedDivRef.current) {
      setFixedDivHeight(fixedDivRef.current.offsetHeight);
    }
  };

  useEffect(() => {
    updateFixedDivHeight();

    window.addEventListener("resize", updateFixedDivHeight);

    return () => {
      window.removeEventListener("resize", updateFixedDivHeight);
    };
  }, []);

  const handleAdd = () => {
    if (!selectedProduct) {
      REJECT(toast, "Chưa có câu hỏi nào được chọn");
    } else {
      const ids = selectedProduct?.map((item) => item?.id) || [];
      restClient({url:'api/quizquestionrelation/createquizquestionrelation',
        method: 'POST',
        data : {
          quizId : id,
          quizQuestionIds : ids
        }
      }).then((res)=>{
        ACCEPT(toast,"Thêm thành công")
        navigate('/dashboard/quiz/managequestionofquizlist/'+id)
      }).catch((err)=>{
        REJECT(toast,"Xảy ra lỗi khi thêm")
      })
    }
  };

  return (
    <div className="min-h-screen flex flex-col gap-20">
      <div ref={fixedDivRef} className="fixed top-0 w-full z-50">
        <Header />
        <Menu />
      </div>
      <div style={{ paddingTop: `${fixedDivHeight + 30}px` }}>
        <Toast ref={toast} />
        <div>
          <div className="flex justify-between pt-1">
            <h1 className="font-bold text-3xl">Danh sách câu hỏi</h1>
          </div>

          <div className="border-2 rounded-md mt-2">
            <div className="mb-10 flex flex-wrap items-center justify-between p-2">
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
                  label="Thêm"
                  icon="pi pi-plus-circle"
                  severity="info"
                  disabled={!selectedProduct || selectedProduct.length === 0}
                  className="bg-blue-600 text-white p-2 text-sm font-normal"
                  onClick={handleAdd}
                />
              </div>
            </div>
            <>
              <DataTable
                value={products}
                loading={loading}
                className="border-t-2"
                tableStyle={{ minHeight: "50rem" }}
                selection={selectedProduct}
                onSelectionChange={(e) => setSelectedProduct(e.value)}
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
                {/* <Column
                  field="score"
                  header="Điểm"
                  className="border-b-2 border-t-2"
                  style={{ width: "15%" }}
                /> */}
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
