import React, { useEffect, useRef, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useSearchParams, useNavigate } from "react-router-dom";
import restClient from "../../services/restClient";
import NotifyProvider from "../../store/NotificationContext";
import { isLoggedIn, removeVietnameseTones } from "../../utils";
import CustomPractice from "../../components/CustomPractice";

export default function ListPractice() {
  const fixedDivRef = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [textSearch, setTextSearch] = useState("");
  const [difficult, setDifficult] = useState(0);
  const [listGrade, setListGrade] = useState([]);
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(12);
  const [totalPage, setTotalPage] = useState(0);
  const [params, setParams] = useSearchParams();
  const [classId, setClassId] = useState();

  // Handle URL parameter changes
  useEffect(() => {
    const textSearchParam = params.get("text") || "";
    const difficultyParam = parseInt(params.get("difficulty")) || 0;
    const classIdParam = params.get("classId") || "";

    setDifficult(difficultyParam);
    setClassId(classIdParam);
  }, [params]);

  useEffect(() => {
    fetchData(page, rows);
  }, [page, rows, textSearch, difficult, classId]);

  useEffect(() => {
    setTimeout(() => {
      if (fixedDivRef.current) {
        setFixedDivHeight(fixedDivRef.current.offsetHeight);
      }
    }, 500);
  }, [fixedDivRef.current]);

  useEffect(() => {
    restClient({
      url: `api/grade/getallgrade?isInclude=false`,
      method: "GET",
    })
      .then((res) => {
        setListGrade(res.data.data || []);
      })
      .catch(() => {
        setListGrade([]);
      });
  }, []);

  const fetchData = (page, rows) => {
    let url = "api/problem/getallproblempagination?StatusProblem=true&";
    const params = new URLSearchParams();

    if (textSearch) {
      params.append("Value", removeVietnameseTones(textSearch.trim()));
    }

    if (isLoggedIn()) {
      params.append("UserId", localStorage.getItem("userId"));
    }

    if (page) {
      params.append("PageIndex", page.toString());
    }

    if (rows) {
      params.append("PageSize", rows.toString());
    }

    if (difficult > 0) {
      params.append("Difficulty", difficult.toString());
    }

    if (classId) {
      params.append("GradeId", classId);
    }

    url += params.toString();

    setLoading(true);
    restClient({
      url,
      method: "GET",
    })
      .then((res) => {
        const paginationData = JSON.parse(res.headers["x-pagination"]);
        setTotalPage(paginationData.TotalPages);
        setProducts(Array.isArray(res.data.data) ? res.data.data : []);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setProducts([]);
        setTotalPage(0);
      })
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => {
    const newDifficulty = e.target.value;
    setPage(1);
    setDifficult(newDifficulty);
    navigate(
      `?text=${textSearch}&difficulty=${newDifficulty}&classId=${classId}`
    );
  };

  const handleGradeChange = (e) => {
    const newClassId = e.target.value;
    setClassId(newClassId);
    setPage(1);
    navigate(
      `?text=${removeVietnameseTones(
        textSearch
      )}&difficulty=${difficult}&classId=${newClassId}`
    );
  };

  const onPageChange = (event) => {
    const { page, rows, first } = event;
    setRows(rows);
    setPage(page + 1);
    setFirst(first);
  };

  return (
    <NotifyProvider>
      <div className="min-h-screen">
        <div ref={fixedDivRef} className="fixed top-0 w-full z-10">
          <Header />
          <Menu />
        </div>
        <div
          style={{ paddingTop: `${fixedDivHeight}px` }}
          className="flex gap-5"
        >
          <div className="flex-1 w-[98%] pt-5">
            <div className="m-4 mb-10 flex flex-wrap items-center gap-3 justify-center sm:justify-between">
              <div className="border-2 border-gray-300 rounded-md p-2">
                <InputText
                  value={textSearch}
                  placeholder="Tìm kiếm"
                  className="flex-1 focus:outline-none w-36 focus:ring-0"
                  onChange={(e) => {
                    setTextSearch(e.target.value);
                    navigate(
                      `?text=${e.target.value}&difficulty=${difficult}&classId=${classId}`
                    );
                  }}
                />
                <Button
                  icon="pi pi-search"
                  className="p-button-warning focus:outline-none focus:ring-0 flex-shrink-0 cursor-pointer"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <div className="border-2 border-gray-300 rounded-md p-2">
                  <select
                    name="difficulty"
                    id="difficulty"
                    value={difficult}
                    onChange={handleChange}
                    className="border border-white outline-none"
                  >
                    <option value={0}>Chọn độ khó</option>
                    <option value={1}>Dễ</option>
                    <option value={2}>Trung bình</option>
                    <option value={3}>Khó</option>
                  </select>
                </div>
                <div className="border-2 rounded-md p-2">
                  <select
                    name="grade"
                    id="grade"
                    value={classId}
                    onChange={handleGradeChange}
                    className="border border-white outline-none"
                  >
                    <option value={0}>Chọn lớp</option>
                    {listGrade.map((item, index) => (
                      <option value={item.id} key={index}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-1">
              {products.map((p, index) => (
                <CustomPractice document={p} key={index} />
              ))}
            </div>
            {products.length === 0 && (
              <div>
                <h1 className="text-gray-400 font-bold text-4xl text-center mt-20">
                  Bài thực hành không tồn tại
                </h1>
              </div>
            )}
            {products.length > 0 && totalPage > 1 && (
              <Paginator
                first={first}
                rows={rows}
                totalRecords={totalPage * rows}
                onPageChange={onPageChange}
                className="custom-paginator mx-auto"
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </NotifyProvider>
  );
}
