import debounce from "lodash.debounce";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
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
import { Dropdown } from "primereact/dropdown";
import AddUser from "./AddUser";


export default function ManageAccount() {
  const toast = useRef(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textSearch, setTextSearch] = useState("");
  const dropDownRef2 = useRef(null);
  const [roleList, setRoleList] = useState([]);
  const [role, setRole] = useState(null);

  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const UserId =localStorage.getItem("userId") 
  useEffect(() => {
    fetchData();
  }, [page, rows, textSearch, role]);

  const fetchData = () => {
    setLoading(true);
    const selectedRole = role ? role?.name : "";
    restClient({
      url: `api/admin/getallmemberbyrolepagination?PageIndex=${page}&PageSize=${rows}&Value=${textSearch}&Role=${selectedRole}&OrderBy=id&IsAscending=false`,
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

  useEffect(() => {
    restClient({
      url: "api/admin/getallroles",
      method: "GET",
    })
      .then((res) => {
        setRoleList(res?.data?.data);
        console.log(res?.data?.data);
      })
      .catch((err) => {
        setRoleList([]);
      });
  }, []);

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
    const isDisabled = UserId === rowData.id;
    return (
      <div style={{ display: "flex" }}>
        <Button
          icon="pi pi-trash"
          className="text-red-600 shadow-none"
          onClick={() => {
            confirmDelete(rowData.id);
          }}
          disabled={isDisabled}
        />
      </div>
    );
  };

  const handleSearch = (text) => {
    setRole(text);
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
  const status = (rowData) => {
    const isActive = !rowData.lockOutEnd;
   
    const isDisabled = UserId === rowData.id;
    return (
      <div className="flex">
        <Button
          icon={isActive ? "pi pi-check-circle" : "pi pi-times-circle"}
          className={`p-button-text ${
            isActive ? "text-green-600" : "text-red-600"
          } p-mr-2 shadow-none`}
          tooltip={isActive ? "Bình thường" : "Đã bị chặn"}
        />
        <Button
          label={isActive ? "Khóa " : " Mở Khóa"}
          className={`border-2 border-${isActive ? "green-600" : "red-600"} ${
            isActive ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
          } rounded-lg p-2 font-semibold  hover:bg-opacity-80 transition duration-300 ease-in-out`}
          onClick={() => handleClick(rowData)}
          disabled={isDisabled}
        />
      </div>
    );
  };
  const handleClick = (rowData) => {
    const isActive = !rowData.lockOutEnd;

    const lockmember = "api/admin/lockmember";
    const unlockmember = "api/admin/unlockmember";

    const apiUrl = isActive ? lockmember : unlockmember;

    // Make the API call
    restClient({
      url: apiUrl,
      method: "POST",
      params: { UserId: rowData?.id },
    })
      .then((response) => {
        fetchData();
      })
      .catch((error) => {
        // Handle error if needed
        console.error("API call failed:", error);
      });
  };

  const formatRoles = (roles) => {
    if (!roles || roles.length === 0) return "N/A";
    return roles.join(", ");
  };
  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog visible={visibleDelete} />
      <AddUser
        visible={visible}
        setVisible={setVisible}
        toast={toast}
        fetchData={fetchData}
        roleList={roleList}
      />
      <div>
        <div className="flex justify-between pt-1">
          <h1 className="font-bold text-3xl">Quản Lý Tài Khoản</h1>
          <div>
            <Button
              label="Thêm Nguời Dùng"
              icon="pi pi-plus-circle"
              severity="info"
              className="bg-blue-600 text-white p-2 text-sm font-normal"
              onClick={() => setVisible(true)}
            />
          </div>
        </div>
        <div className="border-2 rounded-md mt-2">
          <div className="mb-10 flex flex-wrap items-center p-2 gap-4">
            <div className="border-2 rounded-md p-2 flex items-center">
              <InputText
                onChange={(e) =>
                  handleSearchInput(removeVietnameseTones(e.target.value))
                }
                placeholder="Search"
                className="flex-1 focus:outline-none w-36 focus:ring-0"
              />
              <Button
                icon="pi pi-search"
                className="p-button-warning focus:outline-none focus:ring-0 ml-2"
              />
            </div>
            <div className="flex-1 flex items-center justify-end">
              <div className="border-2 rounded-md p-2">
                <Dropdown
                  filter
                  ref={dropDownRef2}
                  value={role}
                  onChange={(e) => handleSearch(e.value)}
                  options={roleList}
                  optionLabel="name"
                  showClear
                  placeholder="Vai trò"
                  className="w-full md:w-14rem shadow-none"
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
                <Column
                  body={status}
                  header="Trạng Thái "
                  className="border-b-2 border-t-2"
                  style={{ width: "15%" }}
                />
                <Column
                  field="roles"
                  header="Vai Trò"
                  className="border-b-2 border-t-2"
                  style={{ width: "15%" }}
                  body={(rowData) => formatRoles(rowData.roles)} // Use the custom renderer
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
