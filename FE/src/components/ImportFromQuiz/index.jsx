import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import restClient from "../../services/restClient";
import { Button } from "primereact/button";
import { ACCEPT, REJECT } from "../../utils";

const ImportFromQuiz = ({ visible, setVisible, id, toast, fetchData }) => {
  const [quizList, setQuizList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [realQuizList, setRealQuizList] = useState([]);

  useEffect(() => {
    if (visible) {
      const fetchQuizData = async () => {
        try {
          const res = await restClient({
            url: "api/quiz/getallquiz",
            method: "GET",
          });

          if (Array.isArray(res?.data?.data)) {
            const filteredData = id
              ? res.data.data.filter(
                  (item) =>
                    Number(item?.id) !== Number(id) &&
                    Number(item?.totalQuestion) > 0
                )
              : res.data.data;

            // Add shuffle property with value false to all items
            const updatedData = filteredData.map((item) => ({
              ...item,
              shuffle: false, // Add shuffle property here
            }));

            setQuizList(updatedData);
            setRealQuizList(updatedData);
          } else {
            setQuizList([]);
            setRealQuizList([]);
          }
        } catch (err) {
          console.error("Failed to fetch quiz data:", err);
          setQuizList([]);
          setRealQuizList([]);
        }
      };

      fetchQuizData();
    }
  }, [visible, id]);

  const check1 = (rowData) => {
    return (
      <input
        id={`${rowData?.id}check1`}
        type="checkbox"
        checked={selectedProduct.some((item) => item.id === rowData.id)}
        onChange={() => handleCheckboxChange(rowData)}
      />
    );
  };

  const check2 = (rowData) => {
    return (
      <input
        id={`${rowData?.id}check2`}
        type="checkbox"
        onChange={() => handleCheckboxChange2(rowData)}
      />
    );
  };

  const handleCheckboxChange2 = (rowData) => {
    setQuizList((prevQuizList) => {
      // Determine if the item is already selected
      const isAlreadySelected = selectedProduct.some(
        (item) => item.id === rowData.id
      );

      const updatedQuizList = prevQuizList.map((item) =>
        item.id === rowData.id
          ? {
              ...item,
              shuffle: isAlreadySelected ? !item.shuffle : !rowData.shuffle,
            }
          : item
      );

      if (isAlreadySelected) {
        setSelectedProduct((prevSelected) =>
          prevSelected.map((item) =>
            item.id === rowData.id ? { ...item, shuffle: !item.shuffle } : item
          )
        );
      }

      return updatedQuizList;
    });
  };

  const handleCheckboxChange = (rowData) => {
    setSelectedProduct((prevSelected) =>
      prevSelected.some((item) => item.id === rowData.id)
        ? prevSelected.filter((item) => item.id !== rowData.id)
        : [...prevSelected, rowData]
    );
  };

  const handleInputChange = (e, index, rowData) => {
    const newValue = Number(e.target.value);

    // Ensure the new value is within the valid range
    const totalQuestion = realQuizList[index]?.totalQuestion || 0;
    const validatedValue = Math.max(1, Math.min(newValue, totalQuestion));

    // Update quizList with new value
    setQuizList((prevQuizList) => {
      const updatedQuizList = prevQuizList.map((item) =>
        item.id === rowData.id
          ? { ...item, totalQuestion: validatedValue }
          : item
      );

      // Update selectedProduct with new totalQuestion value if the item is selected
      setSelectedProduct((prevSelected) =>
        prevSelected.map((item) =>
          item.id === rowData.id
            ? { ...item, totalQuestion: validatedValue }
            : item
        )
      );

      return updatedQuizList;
    });
  };

  const inputTotal = (rowData, { rowIndex }) => {
    return (
      <input
        type="number"
        value={rowData?.totalQuestion || ""}
        className="outline-none border border-gray-300 p-1"
        onChange={(e) => handleInputChange(e, rowIndex, rowData)}
      />
    );
  };

  const generateResponseBody = () => {
    console.log("====================================");
    console.log({
      quizId: id,
      quiQuestionRelationCustomCreate: selectedProduct.map((item) => ({
        quizChildId: item.id,
        numberOfQuestion: item.totalQuestion || 0,
        shuffle: item.shuffle, // Using the shuffle property value
      })),
    });
    console.log("====================================");
    return {
      quizId: id,
      quiQuestionRelationCustomCreate: selectedProduct?.map((item) => ({
        quizChildId: item?.id,
        numberOfQuestion: item?.totalQuestion || 0,
        shuffle: item?.shuffle, // Using the shuffle property value
      })),
    };
  };

  const handlSubmit = () => {
    console.log("====================================");
    console.log(generateResponseBody());
    console.log("====================================");
    restClient({
      url: "api/quizquestionrelation/createquizquestionrelationbyquizcustom",
      method: "POST",
      data: generateResponseBody(),
    }).then((res) => {
        ACCEPT(toast,"Thêm thành công")
        fetchData()
    }).catch((err) => {
        REJECT(toast,"Xảy ra lỗi khi thêm")
    }).finally(()=>{
        setVisible(false);
        setQuizList([]);
        setSelectedProduct([]);
        setRealQuizList([]);
    });
  };

  return (
    <Dialog
      header="Danh sách các bộ câu hỏi"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={() => {
        setVisible(false);
        setQuizList([]);
        setSelectedProduct([]);
        setRealQuizList([]);
      }}
    >
      {!quizList.length ? (
        <div className="font-bold text-center">Không có dữ liệu</div>
      ) : (
        <div>
          <DataTable
            value={quizList}
            className="border-t-2"
            scrollable
            scrollHeight="30rem"
          >
            <Column
              style={{ minWidth: "3rem" }}
              body={check1}
              className="border-b-2 border-t-2 custom-checkbox-column"
            />
            <Column
              field="title"
              style={{ minWidth: "15rem" }}
              header="Bộ câu hỏi"
              className="border-b-2 border-t-2"
            />
            <Column
              style={{ minWidth: "5rem" }}
              header="Lấy ngẫu nhiên"
              body={check2} // If needed
              className="border-b-2 border-t-2"
            />
            <Column
              style={{ minWidth: "5rem" }}
              body={inputTotal}
              header="Tổng số câu hỏi"
              className="border-b-2 border-t-2"
            />
          </DataTable>

          <div className="flex justify-end gap-2 mt-5">
            <Button
              className="p-2 bg-red-500 text-white"
              type="button"
              severity="danger"
              onClick={() => {
                setVisible(false);
                setQuizList([]);
                setSelectedProduct([]);
                setRealQuizList([]);
              }}
            >
              Hủy
            </Button>
            <Button
              className="p-2 bg-blue-500 text-white"
              type="button"
              onClick={handlSubmit}
            >
              Thêm
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default ImportFromQuiz;
