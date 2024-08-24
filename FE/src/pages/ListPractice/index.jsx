import React, { useEffect, useRef, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import CategoryOfClass from "../../components/CategoryOfClass";
import CustomCard from "../../components/CustomCard";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useSearchParams, useNavigate } from "react-router-dom";
import restClient from "../../services/restClient";
import NotifyProvider from "../../store/NotificationContext";
import { removeVietnameseTones } from "../../utils";
import CustomPractice from "../../components/CustomPractice";

export default function ListPractice() {
  const fixedDivRef = useRef(null);

  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const navigate = useNavigate();

  // Document state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [textSearch, setTextSearch] = useState("");

  const [difficult, setDifficult] = useState(0);

  // Pagination state
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(9);
  const [totalPage, setTotalPage] = useState(0);

  const handleChange = (e) => {
    setDifficult(e?.target?.value);
  };

  useEffect(() => {
    setTimeout(() => {
      if (fixedDivRef.current) {
        setFixedDivHeight(fixedDivRef.current.offsetHeight);
      }
    }, 500);
  }, [fixedDivRef.current]);

  useEffect(() => {
    fetchData(page, rows);
  }, [page, rows, textSearch,difficult]);

  const getData = () => {
    fetchData(page, rows);
  };

  const fetchData = (page, rows) => {
    if (textSearch.trim()) {
      setLoading(true);
      restClient({
        url: `api/problem/getallproblempagination?PageSize=${rows}&Value=${textSearch.trim()}${difficult > 0 ? `&Difficulty=${difficult}` : ''}`,
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
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(true);

      restClient({
        url: `api/problem/getallproblempagination?PageSize=${rows}${difficult > 0 ? `&Difficulty=${difficult}` : ''}`,
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
        })
        .finally(() => {
          setLoading(false);
        });
    }
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
              <div className="border-2 border-gray-600 rounded-md p-2">
                <InputText
                  value={textSearch}
                  placeholder="Tìm kiếm"
                  className="flex-1 focus:outline-none w-36 focus:ring-0"
                  onChange={(e) => {
                    setTextSearch(removeVietnameseTones(e.target.value));
                  }}
                />
                <Button
                  icon="pi pi-search"
                  className="p-button-warning focus:outline-none focus:ring-0 flex-shrink-0 cursor-pointer"
                />
              </div>
              <div className="border-2 border-gray-600 rounded-md p-2">
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
