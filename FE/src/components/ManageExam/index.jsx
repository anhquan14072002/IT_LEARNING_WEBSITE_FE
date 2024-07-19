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
import Loading from "../Loading";
import {
  ACCEPT,
  formatDate,
  getTokenFromLocalStorage,
  REJECT,
  removeVietnameseTones,
} from "../../utils";
import { InputSwitch } from "primereact/inputswitch";
import AddExam from "../AddExam";
import UpdateExam from "../UpdateExam";
import AnswerExam from "../AnwserExam";
import ExamCode from "../ExamCode";


export default function ManageExam() {
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
  const [visibleExamCode, setVisibleExamCode] = useState(false);
  const [examCodeValue, setExamCodeValue] = useState(false);
  const [title, setTitle] = useState("");

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
      url: `api/exam/getallexampagination?PageIndex=${page}&PageSize=${rows}`,
      method: "GET",
    })
      .then((res) => {
        const paginationData = JSON.parse(res.headers["x-pagination"]);
        setTotalPage(paginationData.TotalPages);
        setProducts(Array.isArray(res.data.data) ? res.data.data : []);
        console.log(res.data.data);
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
    //     url: `api/exam/searchbyexampagination?Value=${textSearch}&PageIndex=${page}&PageSize=${rows}`,
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

  const examCodeTemple = (rowData) =>{
    return(
     
      <Button
      tooltip="Xem chi tiết các mã đề"
        icon="pi pi-info-circle"
        className="text-blue-600 p-mr-2 shadow-none"
        onClick={() => {
          
          setTitle(rowData?.title)
          setExamCodeValue(rowData);
          setVisibleExamCode(true);
        }}
      />
      
    )
  }
  const anwserTemple = (rowData) => {
    return (
      <div style={{ display: "flex" }}>
        {rowData.type === 1 ? (<h1>Tự Luận</h1>):(<h1>Trắc Nghiệm</h1>)}
      </div>
    );
  };
  const confirmDelete = (id) => {
    setVisibleDelete(true);
    confirmDialog({
      message: "Bạn có chắc chắn muốn xóa đề thi này?",
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
              deleteExam(id);
            }}
          />
        </>
      ),
    });
  };

  const deleteExam = async (id) => {
    await restClient({ url: `api/exam/deleteexam/${id}`, method: "DELETE" })
      .then((res) => {
        fetchData();
        ACCEPT(toast, "Xóa thành công");
      })
      .catch((err) => {
        REJECT(toast, "Xảy ra lỗi khi xóa đề thi này");
      })
      .finally(() => {
        setVisibleDelete(false);
      });
  };

  const handleSearchInput = debounce((text) => {
    setTextSearch(text);
  }, 300);

  const changeStatusExam = async (value, id) => {
    console.log(value, id);
    await restClient({
      url: "api/exam/updatestatusexam?id=" + id,
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
        checked={rowData.isActive}
        onChange={(e) => changeStatusExam(e.value, rowData.id)}
        tooltip={rowData.isActive ? "Đã được duyệt" : "Chưa được duyệt"}
      />
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog visible={visibleDelete} />
      <AddExam
        visible={visible}
        setVisible={setVisible}
        toast={toast}
        fetchData={fetchData}
      />
      <UpdateExam
        visibleUpdate={visibleUpdate}
        setVisibleUpdate={setVisibleUpdate}
        updateValue={updateValue}
        toast={toast}
        fetchData={fetchData}
      />
    
       <ExamCode
        visibleExamCode={visibleExamCode}
        setVisibleExamCode={setVisibleExamCode}
        setTitle={title}
        examCodeValue={examCodeValue}
        toast={toast}
      />
      <div>
        <div className="flex justify-between pt-1">
          <h1 className="font-bold text-3xl">Các Đề Kiểm Tra</h1>
          <div>
            <Button
              label="Thêm mới"
              icon="pi pi-plus-circle"
              severity="info"
              className="bg-blue-600 text-white p-2 text-sm font-normal"
              onClick={() => setVisible(true)}
            />
          </div>
        </div>

        <div className="border-2 rounded-md mt-2">
          <div className="mb-10 flex flex-wrap items-center p-2">
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
                <Column
                  field="#"
                  header="#"
                  body={indexBodyTemplate}
                  className="border-b-2 border-t-2"
                  style={{ width: "5%" }}
                />

                <Column
                  field="title"
                  header="Tiêu đề"
                  className="border-b-2 border-t-2"
                  style={{ width: "15%" }}
                />

                <Column
                  header="Loại đề"
                  className="border-b-2 border-t-2"
                  style={{ width: "15%" }}
                  body={anwserTemple}
                />
               
                <Column
                  header="Chi Tiết"
                  style={{ width: "10%" }}

                  className="border-b-2 border-t-2"
                  body={examCodeTemple}
                />
                 <Column
                  field="province"
                  header="Tỉnh"
                  className="border-b-2 border-t-2"
                  style={{ width: "10%" }}
                />
                <Column
                  header="Trạng thái"
                  className="border-b-2 border-t-2"
                  body={status}
                  style={{ width: "10%" }}
                ></Column>
                <Column
                  field="createdDate"
                  header="Ngày tạo"
                  className="border-b-2 border-t-2"
                  style={{ width: "15%" }}
                  body={(rowData) => formatDate(rowData.createdDate)}
                />
                <Column
                  field="lastModifiedDate"
                  header="Ngày cập nhật"
                  className="border-b-2 border-t-2"
                  style={{ width: "15%" }}
                  body={(rowData) => formatDate(rowData.lastModifiedDate)}
                />
                <Column
                  className="border-b-2 border-t-2"
                  body={actionBodyTemplate}
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
  );
}
