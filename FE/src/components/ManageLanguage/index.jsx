import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ContextMenu } from "primereact/contextmenu";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ProgressSpinner } from "primereact/progressspinner";
import AddDocumentDialog from "../AddDocumentDialog";
import UpdateDocumentDialog from "../UpdateDocumentDialog";
import { ACCEPT, REJECT, formatDate, removeVietnameseTones } from "../../utils";
import restClient from "../../services/restClient";
import Loading from "../Loading";
import AddTopicDialog from "../AddTopicDialog";
import UpdateTopicDialog from "../UpdateTopicDialog";
import debounce from "lodash.debounce";
import AddLanguage from "../AddLanguage";
import UpdateLanguage from "../UpdateLanguage";

export default function ManageLanguage() {
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

  const fetchData = () => {
    setLoading(true);
    restClient({
      url: `api/programlanguage/getallprogramlanguage`,
      method: "GET",
    })
      .then((res) => {
        setProducts(Array.isArray(res.data.data) ? res.data.data : []);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const indexBodyTemplate = (rowData, { rowIndex }) => {
    return <span>{rowIndex}</span>;
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
            const userConfirmed = window.confirm(
              "Are you sure you want to delete this item?"
            );

            if (userConfirmed) {
              deleteDocument(rowData?.id);
            } else {
              setVisibleDelete(false);
            }
          }}
        />
      </div>
    );
  };

  //   confirmDelete(rowData.id);

  const confirmDelete = (id) => {
    setVisibleDelete(true);
    confirmDialog({
      message: "Bạn có chắc chắn muốn chủ đề này?",
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
      url: `api/programlanguage/deleteprogramlanguage/${id}`,
      method: "DELETE",
    })
      .then((res) => {
        fetchData();
        ACCEPT(toast, "Xóa thành công");
      })
      .catch((err) => {
        REJECT(toast, "Xảy ra lỗi khi xóa ngôn ngữ này");
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
      <AddLanguage
        visible={visible}
        setVisible={setVisible}
        toast={toast}
        fetchData={fetchData}
      />
      <UpdateLanguage
        visibleUpdate={visibleUpdate}
        setVisibleUpdate={setVisibleUpdate}
        updateValue={updateValue}
        toast={toast}
        fetchData={fetchData}
      />
      <div>
        <div className="flex justify-between pt-1">
          <h1 className="font-bold text-3xl">Ngôn ngữ</h1>
          <div>
            <Button
              label="Thêm mới"
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
                  style={{ minWidth: "5rem" }}
                />
                <Column
                  field="name"
                  header="Tên ngôn ngữ"
                  className="border-b-2 border-t-2"
                  style={{ minWidth: "12rem" }}
                />
                <Column
                  className="border-b-2 border-t-2"
                  body={actionBodyTemplate}
                />
              </DataTable>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
