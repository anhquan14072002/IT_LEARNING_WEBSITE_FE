import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ContextMenu } from "primereact/contextmenu";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import { ProductService } from "../../services/ProductService";
import { Button } from "primereact/button";
import "./index.css";
import AddDocumentDialog from "../AddDocumentDialog";
import UpdateDocumentDialog from "../UpdateDocumentDialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ACCEPT, REJECT } from "../../utils";

export default function Document() {
  const toast = useRef(null);
  const dropDownRef1 = useRef(null);
  const dropDownRef2 = useRef(null);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [selectedCity, setSelectedCity] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const cm = useRef(null);
  const [visible, setVisible] = useState(false);
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);

  useEffect(() => {
    ProductService.getProductsMini().then((data) => setProducts(data));
  }, []);

  const actionBodyTemplate = (rowData) => {
    return (
      <div style={{ display: "flex" }}>
        <Button
          icon="pi pi-pencil"
          className="text-blue-600 p-mr-2 shadow-none"
          onClick={() => setVisibleUpdate(true)}
        />
        <Button
          icon="pi pi-trash"
          className="text-red-600 shadow-none"
          onClick={() => {
            setVisibleDelete(true);
            confirm()
          }}
        />
      </div>
    );
  };

  const cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const indexBodyTemplate = (rowData, { rowIndex }) => {
    const index = rowIndex + 1; // Calculate the index based on pagination
    return <span>{index}</span>;
  };

  // modal delete
  const confirm = () => {
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
            onClick={() => {
              setVisibleDelete(false);
              ACCEPT(toast);
            }}
          />
        </>
      ),
    });
  };

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog visible={visibleDelete} />
      <AddDocumentDialog
        visible={visible}
        setVisible={setVisible}
        toast={toast}
      />
      <UpdateDocumentDialog
        visibleUpdate={visibleUpdate}
        setVisibleUpdate={setVisibleUpdate}
        toast={toast}
      />
      <div>
        <div className="flex justify-between pt-1">
          <h1 className="font-bold text-3xl">Tài liệu</h1>
          <Button
            label="Thêm mới"
            icon="pi pi-plus-circle"
            severity="info"
            className="bg-blue-600 text-white p-2 text-sm font-normal"
            onClick={() => setVisible(true)}
          />
        </div>

        {/* data */}
        <div className="border-2 rounded-md mt-2">
          <div className="mb-10 flex flex-wrap items-center p-2">
            <div className="border-2 rounded-md p-2">
              <InputText
                placeholder="Search"
                className="flex-1 focus:outline-none w-36 focus:ring-0"
              />
              <Button
                icon="pi pi-search"
                className="p-button-warning focus:outline-none focus:ring-0 flex-shrink-0"
              />
            </div>

            <div className="flex-1 flex gap-3 justify-end">
              <div className="border-2 rounded-md mt-4">
                <Dropdown
                  filter
                  ref={dropDownRef1}
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.value)}
                  options={cities}
                  optionLabel="name"
                  showClear
                  placeholder="Cấp học"
                  className="w-full md:w-14rem shadow-none h-full"
                />
              </div>
              <div className="border-2 rounded-md mt-4">
                <Dropdown
                  filter
                  ref={dropDownRef2}
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.value)}
                  options={cities}
                  optionLabel="name"
                  showClear
                  placeholder="Lớp"
                  className="w-full md:w-14rem shadow-none h-full"
                />
              </div>
            </div>
          </div>
          <DataTable
            value={products}
            onContextMenu={(e) => cm.current.show(e.originalEvent)}
            contextMenuSelection={selectedProduct}
            onContextMenuSelectionChange={(e) => setSelectedProduct(e.value)}
            tableStyle={{ minWidth: "50rem" }}
            className="border-t-2"
          >
            <Column
              field="#"
              header="#"
              body={indexBodyTemplate} 
              className="border-b-2 border-t-2"
            />
            <Column
              field="code"
              header="Tiêu đề"
              className="border-b-2 border-t-2"
            ></Column>
            <Column
              field="name"
              header="Cấp học"
              className="border-b-2 border-t-2"
            ></Column>
            <Column
              field="category"
              header="Lớp"
              className="border-b-2 border-t-2"
            ></Column>
            <Column
              field="category"
              header="Ngày tạo"
              className="border-b-2 border-t-2"
            ></Column>
            <Column
              field="category"
              header="Ngày cập nhật"
              className="border-b-2 border-t-2"
            ></Column>
            <Column
              className="border-b-2 border-t-2"
              body={actionBodyTemplate}
            />
          </DataTable>
          <Paginator
            first={first}
            rows={rows}
            totalRecords={120}
            onPageChange={onPageChange}
            className="custom-paginator mx-auto"
          />
        </div>
      </div>
    </div>
  );
}
