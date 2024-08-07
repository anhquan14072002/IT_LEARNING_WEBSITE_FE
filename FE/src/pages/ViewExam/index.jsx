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
  const [competitionSearch, setCompetitionSearch] = useState("");
  const [yearList, setYearList] = useState([]);
  const [year, setYear] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const province = selectedProvince ? selectedProvince : ""
    const years = year ? year : ""
    const competition = competitionSearch ? competitionSearch : ""
    const id ="id"
    try {
      const res = await restClient({
        url: `api/exam/searchbyexampagination?PageIndex=${page}&PageSize=${rows}&Province=${province}&Year=${years}&CompetitionId=${competition}&OrderBy=${id}&IsAscending=false`,
        method: "GET",
      });
      const paginationData = JSON.parse(res.headers["x-pagination"]);
      setTotalPage(paginationData.TotalPages);
      console.log(paginationData.TotalPages);
      
      setExamList(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setExamList([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [page, rows, selectedProvince, year, competitionSearch]);
  
  useEffect(() => {
    if (province?.data) {
      setProvinceList(province?.data);
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
  }, [province, years]);
  
  const onPageChange = (event) => {
    const { page, rows, first } = event;
    setRows(rows);
    setPage(page + 1);
    setFirst(first);
  };
  
  const handleProvince = (e) => {
    setSelectedProvince(e.value?.name);
  };
  
  const handleCompetition = (e) => {
    setCompetition(e.value?.title);
    setCompetitionSearch(e.value?.id);
  };
  
  const handleYear = (e) => {
    setYear(e.value?.year);
  };
  
  return (
    <>
      <Header />
      <Menu />
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col ">
          <div className=" w-2/3 flex justify-between items-center mx-auto m-4">
            <div>
              <Dropdown
                value={selectedProvince}
                onChange={handleProvince}
                options={provinceList}
                optionLabel="name"
                editable
                placeholder="Tỉnh"
                className="border border-black  rounded-xl  flex items-center w-fit py-2 gap-2.5 shadow-l custom-dropdown"
                filter
              />
            </div>
            <div>
              <Dropdown
                value={competition}
                onChange={handleCompetition}
                options={competitionList}
                optionLabel="title"
                editable
                placeholder="Cuộc Thi"
                className="border border-black  rounded-xl  flex items-center w-fit py-2 gap-2.5 shadow-l custom-dropdown"
                filter
              />
            </div>
            <div>
              <Dropdown
                value={year}
                onChange={handleYear}
                options={yearList}
                optionLabel="year"
                editable
                placeholder="Năm"
                className="border border-black  rounded-xl  flex items-center w-fit py-2 gap-2.5 shadow-l custom-dropdown"
                filter
              />
            </div>
          </div>
        
            {examList.length > 0 ? (
              examList
                .filter((exam) => exam.isActive)
                .map((exam) => (
                  <CardExam id={exam.id} title={exam.title} type={exam.type} />
                ))
            ) : (
              <div className="h-screen flex justify-center items-center">
              <p className="text-2xl font-bold text-blue-800">Hiện Tại Không Có Đề Thi</p>

              </div>
            )}
          
          </div>
   
        
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
    </>
  );
};

export default Index;
