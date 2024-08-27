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
import AddLessonDialog from "../AddLessonDialog";
import UpdateLessonDialog from "../UpdateLessonDialog";
import UpdateDocumentDialog from "../UpdateDocumentDialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import {
  ACCEPT,
  REJECT,
  decodeIfNeeded,
  formatDate,
  getTokenFromLocalStorage,
  removeVietnameseTones,
} from "../../utils";
import Loading from "../Loading";
import restClient from "../../services/restClient";
import { Link, useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { InputSwitch } from "primereact/inputswitch";
import { Tooltip } from "primereact/tooltip";
import { Dialog } from "primereact/dialog";
import { Editor } from "primereact/editor";
import classNames from "classnames";
import PracticeComponent from "../PracticeComponent";
import ManageLanguage from "../ManageLanguage";

export default function ManageCodeOnline() {
  const toast = useRef(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const cm = useRef(null);
  const [loading, setLoading] = useState(false);
  const [modelUpdate, setModelUpdate] = useState({});
  const [textSearch, setTextSearch] = useState("");
  const [loadingDeleteMany, setLoadingDeleteMany] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [content, setContent] = useState("");
  const [visibleDelete, setVisibleDelete] = useState(false);
  const navigate = useNavigate();
  const [navIndex, setNavIndex] = useState(1);

  //pagination
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    fetchData(page, rows);
  }, [page, rows, textSearch]);

  const getData = () => {
    fetchData(page, rows);
  };

  const fetchData = (page, rows) => {
    if (textSearch.trim()) {
      setLoading(true);
      restClient({
        url: `api/problem/getallproblem`,
        method: "GET",
      })
        .then((res) => {
          // const paginationData = JSON.parse(res.headers["x-pagination"]);
          // setTotalPage(paginationData.TotalPages);
          setProducts(Array.isArray(res.data.data) ? res.data.data : []);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setProducts([]);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(true);

      restClient({
        url: `api/problem/getallproblem`,
        method: "GET",
      })
        .then((res) => {
          // const paginationData = JSON.parse(res.headers["x-pagination"]);
          // setTotalPage(paginationData.TotalPages);
          setProducts(Array.isArray(res.data.data) ? res.data.data : []);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setProducts([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div style={{ display: "flex" }}>
        <Button
          icon="pi pi-pencil"
          className="text-blue-600 p-mr-2 shadow-none"
        />
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

  const cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

  const onPageChange = (event) => {
    const { page, rows, first } = event;
    setPage(page + 1);
    setRows(rows);
    setFirst(first);
  };

  const indexBodyTemplate = (rowData, { rowIndex }) => {
    const index = (page - 1) * rows + (rowIndex + 1);
    return <span>{index}</span>;
  };

  const changeStatusLesson = (value, id) => {
    restClient({
      url: "api/lesson/updatestatuslesson?id=" + id,
      method: "PUT",
    })
      .then((res) => {
        ACCEPT(toast, "Thay đổi trạng thái thành công");
        getData();
      })
      .catch((err) => {
        REJECT(toast, "Lỗi khi thay đổi trạng thái");
      });
  };

  const status = (rowData, { rowIndex }) => {
    // return <InputSwitch checked={rowData.isActive} />;
    return (
      <button
        className="bg-blue-600 hover:bg-blue-400 text-white p-2 rounded-md"
        onClick={() =>
          navigate(`/dashboard/updateproblem/${rowData?.id}`)
        }
      >
        Chỉnh sửa mã thực thi
      </button>
    );
  };

  // modal delete
  const confirm = (id) => {
    setVisibleDelete(true);
    confirmDialog({
      message: "Bạn có chắc chắn muốn xóa bài này ?",
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
              deleteLesson(id);
            }}
          />
        </>
      ),
    });
  };

  const description = (rowData, { rowIndex }) => {
    return <p dangerouslySetInnerHTML={{ __html: rowData?.description }}></p>;
  };

  const handleOpenDialog = (content) => {
    setContent(content);
    setVisibleDialog(true);
  };

  const deleteLesson = (id) => {
    restClient({ url: `api/lesson/deletelesson/${id}`, method: "DELETE" })
      .then((res) => {
        getData();
        ACCEPT(toast, "Xóa thành công");
      })
      .catch((err) => {
        REJECT(toast, "Xảy ra lỗi khi xóa tài liệu này");
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
      <Dialog
        header="Nội dung chi tiết"
        visible={visibleDialog}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visibleDialog) return;
          setVisibleDialog(false);
        }}
      >
        <Editor
          value={decodeIfNeeded(content)}
          readOnly={true}
          headerTemplate={<></>}
          className="custom-editor-class"
        />
      </Dialog>
      <ConfirmDialog visible={visibleDelete} />
      <div className="flex justify-start border-b-2 mb-5 border-[#D1F7FF]">
        <h1
          className={classNames("p-5 cursor-pointer hover:bg-[#D1F7FF]", {
            "bg-[#D1F7FF] font-bold": navIndex === 1,
          })}
          onClick={() => setNavIndex(1)}
        >
          Bài thực hành
        </h1>
        <h1
          className={classNames("p-5 cursor-pointer hover:bg-[#D1F7FF]", {
            "bg-[#D1F7FF] font-bold": navIndex === 2,
          })}
          onClick={() => setNavIndex(2)}
        >
          Ngôn ngữ lập trình
        </h1>
      </div>
      {navIndex === 1 && <PracticeComponent />}
      {navIndex === 2 && <ManageLanguage />}
    </div>
  );
}
