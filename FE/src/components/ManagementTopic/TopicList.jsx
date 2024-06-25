import reload from "../../assets/img/icons8-reload-50.png";
import TopicContextProvider, { TopicContext } from "../../store/TopicContext";
import TopicForm from "./TopicForm";
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import questionPng from "../../assets/img/question.png";
import { useFetch } from "use-http";
import axios from "axios";
import restClient from "../../services/restClient";
import { ACCEPT } from "../../utils";
import Loading from "../Loading";

export function TopicsDemo() {
  const { idSelected: topicId, onShow } = useContext(TopicContext);
  const [topic, setTopic] = useState(null);
  const [deleteTopicsDialog, setDeleteTopicsDialog] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState(null);
  const [deleteTopicDialog, setDeleteTopicDialog] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(5);
  const [totalPage, setTotalPage] = useState(0);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchData(page, rows);
  }, [page, rows]);

  const getData = () => {
    fetchData(page, rows);
  };

  const fetchData = (page = 1, rows = 5) => {
    restClient({
      url: `api/topic/getalltopicpagination?PageIndex=${page}&PageSize=${rows}`,
      method: "GET",
    })
      .then((res) => {
        const paginationData = JSON.parse(res.headers["x-pagination"]);
        setTotalPage(paginationData.TotalPages);
        setTopics(Array.isArray(res.data.data) ? res.data.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setTopics([]);
        setLoading(false);
      });
  };

  /* function name: hide dialog delete topic 
  parameter: 
  created by: Đặng Đình Quốc Khánh */
  const hideDeleteTopicDialog = () => {
    try {
      setDeleteTopicDialog(false);
    } catch (err) {
      // handle the error
      if (err instanceof Error) {
        console.error(`Error: ${err.name}`); // the type of error
        console.error(err.message); // the description of the error
      } else {
        // handle other errors
        console.error("Error Unknown:");
        console.error(err);
      }
    }
  };
  /* function name: hide dialog display delete topics 
parameter: 
created by: Đặng Đình Quốc Khánh */
  const hideDeleteTopicsDialog = () => {
    try {
      setDeleteTopicsDialog(false);
    } catch (err) {
      // handle the error
      if (err instanceof Error) {
        console.error(`Error: ${err.name}`); // the type of error
        console.error(err.message); // the description of the error
      } else {
        // handle other errors
        console.error("Error Unknown:");
        console.error(err);
      }
    }
  };

  /* function name: confirm button delete topic 
parameter: topic to delete is object with properties 
created by: Đặng Đình Quốc Khánh */
  const confirmDeleteTopic = (topic) => {
    try {
      setTopic(topic);
      setDeleteTopicDialog(true);
    } catch (err) {
      // handle the error
      if (err instanceof Error) {
        console.error(`Error: ${err.name}`); // the type of error
        console.error(err.message); // the description of the error
      } else {
        // handle other errors
        console.error("Error Unknown:");
        console.error(err);
      }
    }
  };
  /* function name: confirm delete selected show dialog 
parameter: 
created by: Đặng Đình Quốc Khánh */
  const confirmDeleteSelected = () => {
    try {
      console.log(selectedTopics);
      setDeleteTopicsDialog(true);
    } catch (err) {
      // handle the error
      if (err instanceof Error) {
        console.error(`Error: ${err.name}`); // the type of error
        console.error(err.message); // the description of the error
      } else {
        // handle other errors
        console.error("Error Unknown:");
        console.error(err);
      }
    }
  };
  /* function name: handle delete many topics 
parameter: 
created by: Đặng Đình Quốc Khánh */
  const deleteSelectedTopics = () => {
    try {
      console.log(selectedTopics);
    } catch (err) {
      // handle the error
      if (err instanceof Error) {
        console.error(`Error: ${err.name}`); // the type of error
        console.error(err.message); // the description of the error
      } else {
        // handle other errors
        console.error("Error Unknown:");
        console.error(err);
      }
    }
  };

  const leftToolbarTemplate = () => {
    return <h1 className="font-medium text-3xl">Chủ Đề</h1>;
  };

  const rightToolbarTemplate = () => {
    return (
      <Button
        label="Thêm Mới"
        text
        icon="pi pi-plus"
        raised
        onClick={() => onShow(0)}
        className="text-white p-2  bg-[#89CFF3] hover:bg-[#5ab7e6]"
      />
    );
  };
  function editTopicFnc(topic) {
    /* solution: Where is the origin of action from ? 
        -  */
    onShow(topic?.id);
  }
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editTopicFnc(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteTopic(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex justify-between px-3 ">
      <div className="flex gap-7">
        <div class="relative w-96">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            class="block outline-none w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Tìm kiếm theo tiêu đề, tài liệu, mô tả"
            required
          />
        </div>
        {selectedTopics && selectedTopics.length > 0 && (
          <div className="flex flex-wrap gap-5">
            <Button
              label={`Đã chọn: ${selectedTopics.length} `}
              // icon="pi pi-plus"
              severity="success"
            />
            <Button
              label={`Bỏ chọn`}
              icon="pi pi-times"
              severity="success"
              onClick={() => setSelectedTopics([])}
            />
            <Button
              label="Xóa Tất Cả"
              icon="pi pi-trash"
              severity="danger"
              onClick={confirmDeleteSelected}
            />
          </div>
        )}
        <div className="flex justify-between h-10 "></div>
      </div>

      <Button
        text
        raised
        className=" px-3  bg-gray-50 "
        onClick={() => fetchData()}
      >
        <img src={reload} width="20" height="20" />
      </Button>
    </div>
  );
  /* function name: save topic you want to push into database 
  parameter: 
  created by: Đặng Đình Quốc Khánh */
  function saveTopic(parameters) {
    /* solution: Where is the origin of action from ? 
          -  */
  }
  /* function name: delete topic from button agree 
  parameter: 
  created by: Đặng Đình Quốc Khánh */
  async function deleteTopic() {
    restClient({ url: `api/topic/deletetopic/${topic.id}`, method: "DELETE" })
      .then((res) => {
        getData();
        ACCEPT(toast, "Xóa thành công");
      })
      .catch((err) => {
        REJECT(toast, "Xảy ra lỗi khi xóa tài liệu này");
      })
      .finally(() => {
        setDeleteTopicDialog(false);
      });
  }
  const deleteTopicDialogFooter = (
    <React.Fragment>
      <div className="flex justify-end gap-4">
        <Button
          label="Hủy"
          onClick={hideDeleteTopicDialog}
          className="p-button-text px-3 h-10"
        />
        <Button
          label="Đồng ý"
          type="submit"
          onClick={deleteTopic}
          className="text-white px-3 bg-[#89CFF3] hover:bg-[#5ab7e6] h-10"
        />
      </div>
    </React.Fragment>
  );
  const deleteTopicsDialogFooter = (
    <React.Fragment>
      <Button
        label="Hủy"
        onClick={hideDeleteTopicsDialog}
        className="p-button-text px-3 h-10 mr-3"
      />
      <Button
        label="Đồng ý"
        type="submit"
        onClick={deleteSelectedTopics}
        className="text-white px-3 bg-[#89CFF3] hover:bg-[#5ab7e6] h-10"
      />
    </React.Fragment>
  );
  /* function name: handle page change when i click change page 
  parameter: event is default of s 
  created by: Đặng Đình Quốc Khánh */
  const onPageChange = (event) => {
    const { page, rows, first } = event;
    setPage(page + 1);
    setRows(rows);
    setFirst(first);
  };

  return (
    <React.Fragment>
      <TopicForm key={topicId} fetchData={fetchData} toast={toast} />
      <div>
        <Toast ref={toast} />
        <div className="card">
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>

          {loading ? (
            <Loading />
          ) : (
            <DataTable
              ref={dt}
              value={topics}
              selection={selectedTopics}
              onSelectionChange={(e) => {
                setSelectedTopics(e.value);
              }}
              dataKey="id"
              paginator
              scrollable
              scrollHeight="26rem"
              className="shadow-2xl"
              // globalFilter={globalFilter}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              header={header}
              lazy
              first={first}
              rows={rows}
              onPage={onPageChange}
              rowsPerPageOptions={[5, 10, 25]}
              totalRecords={totalPage * rows} // Explicitly setting totalRecords
            >
              <Column
                selectionMode="multiple"
                exportable={false}
                frozen
              ></Column>
              <Column
                field="title"
                header="Tiêu đề"
                sortable
                style={{ minWidth: "12rem" }}
              ></Column>
              <Column
                field="documentTitle"
                header="Tên tài liệu"
                sortable
                style={{ minWidth: "16rem" }}
              ></Column>

              <Column
                field="description"
                header="Mô tả chủ đề"
                sortable
                style={{ minWidth: "8rem" }}
              ></Column>
              <Column
                field="objectives"
                header="Mục tiêu chủ đề"
                sortable
                style={{ minWidth: "10rem" }}
              ></Column>
              <Column
                field="isActive"
                header="Hoạt Động"
                sortable
                style={{ minWidth: "10rem" }}
              ></Column>

              <Column
                body={actionBodyTemplate}
                exportable={false}
                style={{ minWidth: "12rem" }}
              ></Column>
            </DataTable>
          )}
        </div>

        <Dialog
          visible={deleteTopicDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Thông báo"
          modal
          footer={deleteTopicDialogFooter}
          onHide={hideDeleteTopicDialog}
        >
          <div className="confirmation-content">
            <div className="flex gap-4 justify-start items-center">
              <img src={questionPng} width="35" height="35" alt="" srcset="" />
              {topic && (
                <span>
                  Bạn chắc chắn muốn xóa <b>Chủ Đề {topic.title}</b>?
                </span>
              )}
            </div>
          </div>
        </Dialog>
        <Dialog
          visible={deleteTopicsDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Confirm"
          modal
          footer={deleteTopicsDialogFooter}
          onHide={hideDeleteTopicsDialog}
        >
          <div className="confirmation-content">
            <div className="flex gap-4 justify-center items-center">
              <img src={questionPng} width="35" height="35" alt="" srcset="" />
              <span>
                <strong>
                  Bạn có chắc chắn muốn xóa tất cả Chủ Đề được chọn chứ ?
                </strong>
              </span>
            </div>
          </div>
        </Dialog>
      </div>
    </React.Fragment>
  );
}
function TopicList(props) {
  return (
    <TopicContextProvider>
      <TopicsDemo />
    </TopicContextProvider>
  );
}

export default TopicList;
