import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import CardExam from "../../components/CardExam";
import { Dropdown } from "primereact/dropdown";
import { Paginator } from "primereact/paginator";
import Loading from "../../components/Loading";
import restClient from "../../services/restClient";
import "./index.css";
import { province } from "../../services/province";
import { years } from "../../services/year";

const Index = () => {
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [examList, setExamList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [provinceList, setProvinceList] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [competitionList, setCompetitionList] = useState([]);
  const [competition, setCompetition] = useState("");
  const [yearList, setYearList] = useState([]);
  const [year, setYear] = useState("");
 
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await restClient({
        url: `api/exam/searchbyexampagination?PageIndex=${page}&PageSize=${rows}&Size=6&Province=${selectedProvince}&Year=${year}`,
        method: "GET",
      });
      const paginationData = JSON.parse(res.headers["x-pagination"]);
      setTotalPage(paginationData.TotalPages);
      setExamList(Array.isArray(res.data.data) ? res.data.data : []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setExamList([]);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);


  useEffect(() => {
    if (province?.data) {
      setProvinceList(province.data);
    }
    if (years) {
        setYearList(years);
      }
    const fetchDataCompetition = async () => {
      try {
        const response = await restClient({
          url: "api/competition/getallcompetition",
          method: "GET",
        });
        console.log(response?.data?.data);
        setCompetitionList(
          Array.isArray(response?.data?.data) ? response?.data?.data : []
        );
      } catch (error) {
        console.log("error");
      }
    };
  
    fetchDataCompetition();
  }, [province,years]);
  const onPageChange = (event) => {
    const { page, rows, first } = event;
    setRows(rows);
    setPage(page + 1);
    setFirst(first);
  };

  return (
    <>
      <Header />
      <Menu />
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col">
          <div className="flex w-2/3 justify-between items-center mx-auto m-4">
            <div className="card flex justify-content-center">
              <Dropdown
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.value?.name)}
                options={provinceList}
                optionLabel="name"
                editable
                placeholder="Tỉnh"
                className="border border-black rounded-xl flex items-center w-2/3 py-2 gap-2.5 shadow-none custom-dropdown"
                filter
                
              />
            </div>
            <div>
              <Dropdown
                value={competition}
                onChange={(e) => setCompetition(e.value)}
                options={competitionList}
                optionLabel="title"
                editable
                placeholder="Cuộc Thi"
                 className="border border-black rounded-xl flex items-center w-2/3 py-2 gap-2.5 shadow-none custom-dropdown"
                filter
              />
            </div>
            <div>
              <Dropdown
                value={year}
                onChange={(e) => setYear(e.value?.year)}
                options={yearList}
                optionLabel="year"
                editable
                placeholder="Năm"
                className="border border-black rounded-xl flex items-center w-2/3 py-2 gap-2.5 shadow-none custom-dropdown"
                filter
              />
            </div>
            <div>
              <div className="border border-black rounded-3xl flex items-center px-2.5 py-2 gap-2.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="22"
                  height="22"
                  viewBox="0,0,256,256"
                  className="fill-black"
                >
                  <g
                    fillRule="nonzero"
                    stroke="none"
                    strokeWidth="1"
                    strokeLinecap="butt"
                    strokeLinejoin="miter"
                    strokeMiterlimit="10"
                    strokeDasharray=""
                    strokeDashoffset="0"
                    fontFamily="none"
                    fontWeight="none"
                    fontSize="none"
                    textAnchor="none"
                    style={{ mixBlendMode: "normal" }}
                  >
                    <g transform="scale(5.12,5.12)">
                      <path d="M21,3c-9.37891,0 -17,7.62109 -17,17c0,9.37891 7.62109,17 17,17c3.71094,0 7.14063,-1.19531 9.9375,-3.21875l13.15625,13.125l2.8125,-2.8125l-13,-13.03125c2.55469,-2.97656 4.09375,-6.83984 4.09375,-11.0625c0,-9.37891 -7.62109,-17 -17,-17zM21,5c8.29688,0 15,6.70313 15,15c0,8.29688 -6.70312,15 -15,15c-8.29687,0 -15,-6.70312 -15,-15c0,-8.29687 6.70313,-15 15,-15z"></path>
                    </g>
                  </g>
                </svg>
                <input
                  id="search"
                  placeholder="Tìm kiếm"
                  className="border-none text-black focus:outline-none placeholder:text-white"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center mx-auto w-4/6 h-screen bg-gray-100">
            {examList.length > 0 ? (
              examList
                .filter((exam) => exam.isActive)
                .map((exam) => (
                  <CardExam id={exam.id} title={exam.title} type={exam.type} />
                ))
            ) : (
              <p>No exams available</p>
            )}
            {examList.length > 0 && (
              <>
                <div className="flex-grow"></div>
                <div>
                  <Paginator
                    first={first}
                    rows={rows}
                    totalRecords={totalPage * rows}
                    onPageChange={onPageChange}
                    className="custom-paginator mx-auto mb-2"
                  />
                </div>
              </>
            )}
          </div>
          <div className="mx-auto">Top 5</div>
        </div>
      )}
    </>
  );
};

export default Index;
