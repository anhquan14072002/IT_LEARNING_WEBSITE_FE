import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../shared/CustomTextInput";
import CustomDropdown from "../../shared/CustomDropdown";
import CustomEditor from "../../shared/CustomEditor";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import restClient from "../../services/restClient";
import Loading from "../Loading";
import { decodeIfNeeded, isBase64, REJECT, SUCCESS } from "../../utils";
import "./index.css";
import CustomDropdownInSearch from "../../shared/CustomDropdownInSearch";
import { MultiSelect } from "primereact/multiselect";

export default function UpdateLessonDialog({
  visibleUpdate,
  setVisibleUpdate,
  toast,
  getData,
  modelUpdate,
}) {
  const [files, setFiles] = useState([]);
  const [topicList, setListTopic] = useState([]);
  const [gradeList, setListGrade] = useState([]);
  const [documentList, setListDocument] = useState([]);
  const [isLoadingAddUpdate, setIsLoadingAddUpdate] = useState(false);
  const [initialValuesReady, setInitialValuesReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const [tagList, setTagList] = useState([]);
  const [tag, setTag] = useState(null);

  // Select input content type
  const [inputContent, setInputContent] = useState(!!modelUpdate.content); // Initialize based on modelUpdate.content

  const validationSchema = Yup.object({
    title: Yup.string()
      .trim()
      .required("Tiêu đề không được bỏ trống")
      .min(5, "Tiêu đề phải có ít nhất 5 ký tự")
      .max(250, "Tiêu đề không được vượt quá 250 ký tự"),
    ...(inputContent && {
      content: Yup.string().required("Mô tả không được bỏ trống"),
    }),
    topic: Yup.object()
      .test("is-not-empty", "Chủ đề không được bỏ trống", (value) => {
        return Object.keys(value).length !== 0;
      })
      .required("Chủ đề không được bỏ trống"),
    grade: Yup.object()
      .test("is-not-empty", "Không được để trống trường này", (value) => {
        return Object.keys(value).length !== 0; // Check if object is not empty
      })
      .required("Không bỏ trống trường này"),
    document: Yup.object()
      .test("is-not-empty", "Không được để trống trường này", (value) => {
        return Object.keys(value).length !== 0; // Check if object is not empty
      })
      .required("Không bỏ trống trường này"),
    index: Yup.number()
      .required("Vui lòng nhập số thứ tự của bài học")
      .integer("Số thứ tự phải là số nguyên")
      .min(1, "Số thứ tự phải từ 1 trở lên")
      .max(100, "Số thứ tự không được vượt quá 100"),
  });

  const [clearTopic, setClearTopic] = useState(false);
  const [clearGrade, setClearGrade] = useState(false);

  const [initialValues, setInitialValues] = useState({
    title: "",
    topic: {},
    ...(inputContent && {
      content: decodeIfNeeded(modelUpdate.content),
    }),
    document: {},
    grade: {},
    index: null,
  });

  const removeBeforeFirstColon = (inputString) => {
    // Find the index of the first colon
    let colonIndex = inputString.indexOf(":");

    // If there's no colon, return the original string
    if (colonIndex === -1) {
      return inputString;
    }

    // Return the substring after the colon, trimmed to remove any leading whitespace
    return inputString.substring(colonIndex + 1).trim();
  };

  const handleChangeInputType = (e) => {
    setInputContent(e.target.value === "true"); // Convert the selected value to a boolean
  };

  useEffect(() => {
    setInputContent(!!modelUpdate.content);
  }, [modelUpdate]);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      try {
        const topicResponse = await restClient({
          url: `api/topic/gettopicbyid?id=${modelUpdate.topicId}`,
          method: "GET",
        });

        const selectedTopic = topicResponse.data?.data;

        const documentResponse = await restClient({
          url: `api/document/getdocumentbyid/${selectedTopic.documentId}`,
          method: "GET",
        });

        const selectedDocument = documentResponse.data?.data;

        const gradeResponse = await restClient({
          url: `api/grade/getgradebyid/${selectedDocument.gradeId}`,
          method: "GET",
        });

        const selectedGrade = gradeResponse.data?.data;

        const listGradeResponse = await restClient({
          url: `api/grade/getallgrade?isInclude=false`,
          method: "GET",
        });

        const listGrade = listGradeResponse.data?.data;

        const listDocumentByIdResponse = await restClient({
          url: `api/document/getalldocumentbygrade/` + selectedGrade.id,
          method: "GET",
        });

        const listDocumentById = listDocumentByIdResponse.data?.data;

        const listTopicByDocuResponse = await restClient({
          url: `api/topic/getalltopicbydocument/` + selectedDocument.id,
          method: "GET",
        });

        const listTopicByDocu = listTopicByDocuResponse.data?.data;

        setListTopic(listTopicByDocu);
        setListDocument(listDocumentById);
        setListGrade(listGrade);

        console.log("decoded content::", decodeIfNeeded(modelUpdate.content));

        const updatedInitialValues = {
          title: removeBeforeFirstColon(modelUpdate.title),
          content: decodeIfNeeded(modelUpdate.content),
          topic: selectedTopic || {},
          grade: selectedGrade || {},
          document: selectedDocument || {},
          index: modelUpdate?.index || null,
        };

        try {
          const tagTopic = await restClient({
            url: `api/lesson/getlessonidbytag/${modelUpdate?.id}`,
            method: "GET",
          });
          setTag(tagTopic?.data?.data || null);
        } catch (error) {
          setTag(null);
        }

        const tagResponse = await restClient({
          url: "api/tag/getalltag",
          method: "GET",
        });
        setTagList(
          Array.isArray(tagResponse?.data?.data) ? tagResponse?.data?.data : []
        );

        setInitialValues(updatedInitialValues);
        setInitialValuesReady(true); // Data has been fetched and initial values are set
      } catch (err) {
        setInitialValues({});
      } finally {
        setLoading(false);
      }
    };

    if (visibleUpdate) {
      fetchTopics();
    }
  }, [visibleUpdate, modelUpdate]);

  const onSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("Id", modelUpdate.id);
    formData.append("Title", values.title);
    formData.append("Index", values.index);
    formData.append("TopicId", values.topic.id); // Use topic.id for TopicId
    if (tag && tag.length > 0) {
      tag.forEach((item, index) => {
        formData.append(`tagValues[${index}]`, item.keyWord);
      });
    }
    if (inputContent) {
      formData.append("Content", values.content);
    }
    formData.append("IsActive", false);

    if (!inputContent) {
      if (files.length === 0) {
        REJECT(toast, "Vui lòng chọn file để tải lên");
        return;
      }
      if (files.some((file) => file.size > 10485760)) {
        REJECT(toast, "Vui lòng chọn file nhỏ hơn hoặc bằng 10mb");
        return;
      }
      if (files) {
        files.forEach((file) => {
          formData.append("FilePath", file);
        });
      }
    } else if (inputContent) {
      formData.append("FilePath", null);
    }

    try {
      setIsLoadingAddUpdate(true);
      await restClient({
        url: "api/lesson/updatelesson",
        method: "PUT",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      SUCCESS(toast, "Cập nhật bài học thành công");

      // Reset form state and fetch new data
      setFiles([]);
      getData(); // Fetch updated data
    } catch (err) {
      if (err.response && err.response.data) {
        const { message } = err.response.data;
        if (message === "Lesson Index is Duplicate !!!") {
          REJECT(toast, "Số thứ tự của bài học đã tồn tại!");
        } else {
          REJECT(toast, "Xảy ra lỗi khi thêm bài học");
        }
      } else {
        REJECT(toast, "Xảy ra lỗi khi thêm bài học");
      }
    } finally {
      setIsLoadingAddUpdate(false);
      setVisibleUpdate(false);
      setSubmitting(false);
    }
  };

  const onFileSelect = (e) => {
    setFiles(e.files);
  };

  const handleOnChangeGrade = (e, helpers, setTouchedState, props) => {
    setClearTopic(true);
    setClearGrade(true);
    helpers.setValue(e.value);
    setTouchedState(true); // Set touched state to true when onChange is triggered
    if (props.onChange) {
      props.onChange(e); // Propagate the onChange event if provided
    }
    restClient({
      url: `api/document/getalldocumentbygrade/` + e.target.value.id,
      method: "GET",
    })
      .then((res) => {
        setListDocument(res.data.data || []);
        setListTopic([]);
      })
      .catch((err) => {
        setListDocument([]);
        setListTopic([]);
      });
  };

  const handleOnChangeDocument = (e, helpers, setTouchedState, props) => {
    setClearTopic(true);
    if (!e.target.value || !e.target.value.id) {
      setListTopic([]);
      helpers.setValue({});
      setTouchedState(true); // Set touched state to true when onChange is triggered
      if (props.onChange) {
        props.onChange(e); // Propagate the onChange event if provided
      }
      return; // Exit early if e.target.value or e.target.value.id is undefined
    }

    helpers.setValue(e.value);
    setTouchedState(true); // Set touched state to true when onChange is triggered
    if (props.onChange) {
      props.onChange(e); // Propagate the onChange event if provided
    }

    restClient({
      url: `api/topic/getalltopicbydocument/` + e.target.value.id,
      method: "GET",
    })
      .then((res) => {
        setListTopic(res.data.data || []);
      })
      .catch((err) => {
        setListTopic([]);
      });
  };

  return (
    <Dialog
      header="Cập nhật bài học"
      visible={visibleUpdate}
      style={{ width: "50vw" }}
      onHide={() => {
        setFiles([]);
        setVisibleUpdate(false);
        setInitialValuesReady(false); // Reset the readiness state when the dialog is closed
      }}
    >
      {isLoadingAddUpdate ? (
        <Loading />
      ) : (
        initialValuesReady && (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize={true}
          >
            {({ isSubmitting }) => (
              <Form>
                <CustomDropdownInSearch
                  title="Chọn lớp"
                  label="Lớp"
                  name="grade"
                  id="grade"
                  isClear={false}
                  handleOnChange={handleOnChangeGrade}
                  options={gradeList}
                />

                <CustomDropdownInSearch
                  title="Chọn tài liệu"
                  label="Tài liệu"
                  name="document"
                  id="document"
                  isClear={true}
                  clearGrade={clearGrade}
                  setClearGrade={setClearGrade}
                  disabled={!documentList || documentList.length === 0} // Disable if documentList is empty or undefined
                  handleOnChange={handleOnChangeDocument}
                  options={documentList}
                />

                <CustomDropdown
                  label="Chủ đề"
                  title="Chọn chủ đề"
                  name="topic"
                  id="topic"
                  clearTopic={clearTopic}
                  setClearTopic={setClearTopic}
                  disabled={!topicList || topicList.length === 0}
                  options={topicList}
                />

                <CustomTextInput
                  label="Bài số"
                  name="index"
                  type="number"
                  id="index"
                />

                <CustomTextInput
                  label="Tiêu đề"
                  name="title"
                  type="text"
                  id="title"
                />

                <div>
                  <>
                    <span>Tag</span>
                  </>
                  <MultiSelect
                    value={tag}
                    options={tagList}
                    onChange={(e) => setTag(e.value)}
                    optionLabel="title"
                    placeholder="Chọn Tag"
                    className="w-full shadow-none custom-multiselect border border-gray-300"
                    display="chip"
                    filter
                  />
                </div>

                <div className="flex justify-between mb-1">
                  <h1>
                    Nội dung bài học <span className="text-red-500">*</span>
                  </h1>
                  <select
                    value={inputContent.toString()} // Ensure this matches with the state variable
                    onChange={handleChangeInputType} // Make sure handleChangeInputType is correctly defined
                    className="text-sm border border-gray-300 p-1 rounded-md"
                  >
                    <option value="true">Soạn bài</option>
                    <option value="false">Tải file lên</option>
                  </select>
                </div>

                {inputContent ? (
                  <div>
                    <CustomEditor name="content" id="content">
                      <ErrorMessage name="content" component="div" />
                    </CustomEditor>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="fileUpload">Tải file lên</label>
                    <FileUpload
                      id="fileUpload"
                      name="files"
                      url={"/api/upload"}
                      accept=".docx, application/vnd.openxmlformats-officedocument.wordprocessingml.document, .pdf, application/pdf"
                      maxFileSize={10485760} // 10MB
                      emptyTemplate={
                        <p className="m-0">
                          Drag and drop files here to upload.
                        </p>
                      }
                      className="custom-file-upload mb-2"
                      onSelect={onFileSelect}
                      onRemove={() => setFiles([])}
                      onClear={() => setFiles([])}
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    className="p-2 bg-red-500 text-white"
                    type="button"
                    severity="danger"
                    onClick={() => setVisibleUpdate(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    className="p-2 bg-blue-500 text-white"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Cập nhật
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        )
      )}
    </Dialog>
  );
}
