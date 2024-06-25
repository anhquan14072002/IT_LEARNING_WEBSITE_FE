import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { TopicContext } from "../../store/TopicContext";
import { Dropdown } from "primereact/dropdown";
import { Controller, useForm } from "react-hook-form";
import exclamation from "../../assets/img/exclamation.png";
import Loading from "../Loading";
import { REJECT, SUCCESS } from "../../utils";
import restClient from "../../services/restClient";

const errorsInput = {
  topicName: "Chủ đề yêu cầu phải nhập",
  description: "Mô tả yêu cầu phải nhập ",
  documentName: "Tên tài liệu yêu cầu phải nhập",
  objectives: "Mục tiêu yêu cầu phải nhập",
};
export default function TopicForm({ fetchData, toast }) {
  const { isShow, idSelected, data: topics, onShow } = useContext(TopicContext);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [errorsTopicDialog, setErrorsTopicDialog] = useState(false);
  const [topic, setTopic] = useState({
    title: "",
    description: "",
    objectives: "",
  });
  const [documents, setDocuments] = useState([]);
  const [isClickButton, setIsClickButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      documentName: topics?.find((e) => e.Id === idSelected)?.Document,
    },
  });

  const fetchTopicById = useCallback(() => {
    setLoading(true);
    restClient({
      url: `api/topic/gettopicbyid?id=${idSelected}`,
      method: "GET",
    })
      .then((res) => {
        setTopic(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);

        setLoading(false);
      });
  }, []);
  useEffect(() => {
    try {
      if (idSelected != 0) {
        fetchTopicById();
      }
      setLoading(true);
      restClient({
        url: `api/document/getalldocument`,
        method: "GET",
      })
        .then((res) => {
          setDocuments(res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);

          setLoading(false);
        });
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
  }, [fetchTopicById, idSelected]);

  useEffect(() => {
    try {
      if (isEmpty(errors) === false && isClickButton) {
        setErrorsTopicDialog(true);
      }
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
  }, [errors, isClickButton]);

  useEffect(() => {
    if (topic) {
      setSelectedDocument(topic?.documentTitle);
    }
  }, [topic]);
  /* function name: check empty
  parameter: 
  created by: Đặng Đình Quốc Khánh */
  const isEmpty = (obj) => {
    try {
      return Object.keys(obj).length === 0;
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
  /* function name: action Create and update topic 
  parameter: 
  created by: Đặng Đình Quốc Khánh */
  async function actionTopic(output) {
    let method = idSelected != 0 ? "PUT" : "POST";
    let url = idSelected != 0 ? "updatetopic" : "createtopic";
    let message =
      idSelected != 0
        ? "Cập Nhật tài liệu thành công"
        : "Thêm tài liệu thành công";
    restClient({
      url: `api/topic/${url}`,
      method: method,
      data: output,
    })
      .then((res) => {
        console.log(res);
        SUCCESS(toast, message);
        fetchData();
        setLoading(false);
      })
      .catch((err) => {
        REJECT(toast, err.message);
        setLoading(false);
      })
      .finally(() => {
        // setVisible(false);
        onShow();
      });
  }

  /* function name: submit handle data 
parameter: 
created by: Đặng Đình Quốc Khánh */
  const onSubmit = async (data) => {
    setLoading(true);
    const output = {
      title: data.topicName,
      description: data.description,
      objectives: data.objectives,
      documentId: data.documentName.id,
    };
    await actionTopic(idSelected != 0 ? { id: idSelected, ...output } : output);
    reset({});
    setSelectedDocument(null);
  };

  /* function name: onchange input 
  parameter: 
  created by: Đặng Đình Quốc Khánh */
  function changeInputTitle(event, title) {
    console.log(1234);
    try {
      setTopic((preTopic) => {
        return {
          ...preTopic,
          [title]: event.target.value,
        };
      });
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
  } /* function name: hide delete topic 
  parameter: 
  created by: Đặng Đình Quốc Khánh */
  const hideDeleteTopicDialog = () => {
    try {
      setErrorsTopicDialog(false);
      setIsClickButton(false);
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

  const onHandle = () => {
    setIsClickButton(true);
  };
  const deleteTopicDialogFooter = (
    <React.Fragment>
      <div className="flex justify-end gap-4">
        <Button
          label="Đồng ý"
          type="submit"
          onClick={hideDeleteTopicDialog}
          className="text-white px-3 bg-[#89CFF3] hover:bg-[#5ab7e6] h-10"
        />
      </div>
    </React.Fragment>
  );
  let input =
    "mt-1 px-3 py-4 h-13 bg-white border shadow-sm placeholder-slate-400 focus:outline-none block w-full rounded-md sm:text-sm focus:ring-1 ";
  let errorInput =
    "border-red-500 focus:border-red-500 focus:ring-red-500 shadow-none";
  let successInput =
    "border-slate-300 focus:border-border-focus focus:ring-[#a5f3fc] focus:shadow-custom-focus";
  let dropdownCss = "w-full pb-1 md:w-14rem border";

  let header = idSelected != 0 ? "Sửa Chủ Đề" : "Thêm Mới Chủ Đề";
  let buttonForm = idSelected != 0 ? "Cập Nhât" : "Thêm Mới";

  return (
    <>
      {loading === true ? (
        <Loading />
      ) : (
        <Dialog
          header={header}
          visible={isShow}
          style={{ width: "50vw" }}
          onHide={() => {
            onShow();
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div class="mt-3 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* <div className="sm:grid-cols-6"> */}
              <div class="sm:col-span-3">
                <label
                  for="topicName"
                  class="block text-sm font-bold leading-6 text-gray-900"
                >
                  Chủ đề &nbsp; &nbsp;
                  <span className="text-red-500">*</span>
                </label>
                <div class="mt-2">
                  <input
                    type="text"
                    name="Topic Name"
                    value={topic.title}
                    id="topicName"
                    autoComplete="given-name"
                    className={`${input} ${
                      errors.topicName ? errorInput : successInput
                    }`}
                    {...register("topicName", { required: true })}
                    onChange={() => changeInputTitle(event, "title")}
                  />
                  {errors.topicName && (
                    <span className="text-red-500">
                      {errorsInput?.topicName}
                    </span>
                  )}
                </div>
              </div>
              <div class="sm:col-span-3">
                <label
                  for="first-name"
                  class="block text-sm font-bold leading-6 text-gray-900"
                >
                  Tài liệu&nbsp; &nbsp;
                  <span className="text-red-500">*</span>
                </label>
                <div class="mt-2">
                  <Controller
                    name="documentName"
                    control={control}
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                      <Dropdown
                        value={selectedDocument}
                        onChange={(e) => {
                          field.onChange(e.value);
                          setSelectedDocument(e.value);
                        }}
                        options={documents}
                        optionLabel="title"
                        placeholder="Select a Document"
                        className={`${dropdownCss} ${
                          errors.documentName ? errorInput : successInput
                        }`}
                      />
                    )}
                  />
                  {errors.documentName && (
                    <span className="text-red-500">
                      {errorsInput.documentName}
                    </span>
                  )}
                </div>
              </div>

              <div class="col-span-full">
                <label
                  for="Description"
                  class="block text-sm font-bold leading-6 text-gray-900"
                >
                  Mô tả chủ đề &nbsp; &nbsp;
                  <span className="text-red-500">*</span>
                </label>
                <div class="mt-2">
                  <textarea
                    id="Description"
                    name="Description"
                    rows="3"
                    value={topic?.description}
                    className={`${input} ${
                      errors.description ? errorInput : successInput
                    }`}
                    {...register("description", { required: true })}
                    onChange={() => changeInputTitle(event, "description")}
                  ></textarea>
                  {errors.description && (
                    <span className="text-red-500">
                      {errorsInput.description}
                    </span>
                  )}
                </div>
              </div>
              <div class="col-span-full">
                <label
                  for="Objectives"
                  class="block text-sm font-bold leading-6 text-gray-900"
                >
                  Mục tiêu &nbsp; &nbsp;
                  <span className="text-red-500">*</span>
                </label>
                <div class="mt-2">
                  <textarea
                    id="Objectives"
                    name="Objectives"
                    value={topic?.objectives}
                    rows="3"
                    className={`${input} ${
                      errors.objectives ? errorInput : successInput
                    }`}
                    {...register("objectives", { required: true })}
                    onChange={() => changeInputTitle(event, "objectives")}
                  ></textarea>
                  {errors.objectives && (
                    <span className="text-red-500">
                      {errorsInput.objectives}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className=" flex justify-end gap-3 mt-6">
              <Button
                label="Cancel"
                // icon="pi pi-times"
                type="reset"
                onClick={onShow}
                className="p-button-text px-3 h-10"
              />
              <Button
                label={buttonForm}
                onClick={onHandle}
                type="submit"
                className="text-white px-3 bg-[#89CFF3] hover:bg-[#5ab7e6] h-10"
              />
            </div>
          </form>
        </Dialog>
      )}

      <Dialog
        visible={errorsTopicDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Thông báo"
        modal
        footer={deleteTopicDialogFooter}
        onHide={hideDeleteTopicDialog}
      >
        <div className="confirmation-content">
          <div className="flex justify-start gap-8 items-center">
            <img src={exclamation} width="35" height="35" alt="" srcset="" />
            <ul>
              {Object.entries(errors).map(([key, value]) => {
                const errMessage = errorsInput[key];
                return (
                  <li key={key}>
                    <strong>- &nbsp; &nbsp; {errMessage}</strong>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Dialog>
    </>
  );
}
