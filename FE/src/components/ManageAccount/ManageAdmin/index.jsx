import debounce from "lodash.debounce";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import restClient from "../../../services/restClient";
import Loading from "../../Loading";
import {
  ACCEPT,
  formatDate,
  getTokenFromLocalStorage,
  REJECT,
  removeVietnameseTones,
} from "../../../utils";
import { InputSwitch } from "primereact/inputswitch";

export default function ManageExam() {
  const toast = useRef(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textSearch, setTextSearch] = useState("");
  const [visibleExamCode, setVisibleExamCode] = useState(false);
  const [examCodeValue, setExamCodeValue] = useState(null);
  const [title, setTitle] = useState("");
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    fetchData();
  }, [page, rows, textSearch]);

  const fetchData = () => {
    setLoading(true);
    const role = "admin";
    restClient({
      url: `api/admin/searchmemberbyrolepagination?PageIndex=${page}&PageSize=${rows}&role=${role}&Value=${textSearch}`,
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

  const actionBodyTemplate = (rowData) => {
    return (
      <div style={{ display: "flex" }}>
       
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
      message: "Bạn có chắc chắn muốn xóa tài khoản này?",
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
              deleteMember(id);
            }}
          />
        </>
      ),
    });
  };

  const deleteMember = async (id) => {
    await restClient({
      url: `api/admin/deletemember`,
      method: "DELETE",
      params: { UserId: id },
    })
      .then(() => {
        fetchData();
        ACCEPT(toast, "Xóa thành công");
      })
      .catch(() => {
        REJECT(toast, "Xảy ra lỗi khi xóa tài khoản này");
      })
      .finally(() => {
        setVisibleDelete(false);
      });
  };

  const handleSearchInput = debounce((text) => {
    setTextSearch(text);
  }, 300);

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog visible={visibleDelete} />
      <div>
        <div className="flex justify-between pt-1">
          <h1 className="font-bold text-3xl">Quản Lý Quản Trị Viên</h1>
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
                  field="userName"
                  header="Tài Khoản "
                  className="border-b-2 border-t-2"
                  style={{ width: "15%" }}
                />

                <Column
                  field="email"
                  header="Email "
                  className="border-b-2 border-t-2"
                  style={{ width: "15%" }}
                />
                <Column
                  field="phoneNumber"
                  header="SĐT "
                  className="border-b-2 border-t-2"
                  style={{ width: "15%" }}
                />
                {/* <Column
                  header="Chi Tiết"
                  className="border-b-2 border-t-2"
                  style={{ width: "10%" }}
                  body={examCodeTemplate}
                /> */}

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
                  style={{ width: "5%" }}
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
