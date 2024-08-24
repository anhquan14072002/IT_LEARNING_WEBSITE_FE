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
import NotifyProvider from "../../store/NotificationContext";

const Index = () => {
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [examList, setExamList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [provinceList, setProvinceList] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedProvince1, setSelectedProvince1] = useState("");
  const [competitionList, setCompetitionList] = useState([]);
  const [competition, setCompetition] = useState("");
  const [competitionSearch, setCompetitionSearch] = useState("");
  const [yearList, setYearList] = useState([]);
  const [year, setYear] = useState("");
  const [levelList, setLevelList] = useState([]);
  const [level, setLevel] = useState("");
  const [gradeList, setGradeList] = useState([]);
  const [grade, setGrade] = useState("");
  const [levelSearch, setLevelSearch] = useState("");
  const [gradeSearch, setGradeSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const province = selectedProvince1 ? selectedProvince1 : "";
    const years = year ? year : "";
    const competition = competitionSearch ? competitionSearch : "";
    const level = levelSearch ? levelSearch : "";
    const grade = gradeSearch ? gradeSearch : "";
    try {
      const res = await restClient({
        url: `api/exam/getallexampagination?PageIndex=${page}&PageSize=${rows}&Province=${province}&Year=${years}&CompetitionId=${competition}&LevelId=${level}&GradeId=${grade}&OrderBy=id&IsAscending=false&Status=true`,
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
  }, [page, rows, selectedProvince, year, competitionSearch,levelSearch, gradeSearch]);

  useEffect(() => {
    if (province?.data) {
      setProvinceList(province?.data);
    }
    if (years) {
      setYearList(years);
    }
    const fetchDataCompetition = async () => {
      try {
        const [competitionResponse, levelResponse, gradeResponse] =
        await Promise.all([
          restClient({
            url: "api/competition/getallcompetition",
            method: "GET",
          }),
          restClient({ url: "api/level/getalllevel", method: "GET" }),
          restClient({ url: "api/grade/getallgrade?isInclude=false", method: "GET" }),
        ]);

      setCompetitionList(competitionResponse?.data?.data || []);
      setLevelList(levelResponse?.data?.data || []);
      setGradeList(gradeResponse?.data?.data || []);
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
    setSelectedProvince1(e.value?.name_en);
  };

  const handleCompetition = (e) => {
    setCompetition(e.value?.title);
    setCompetitionSearch(e.value?.id);
  };
  const handleLevel = (e) => {
    setLevel(e.value?.title);
    setLevelSearch(e.value?.id);
  };
  const handleGrade = (e) => {
    setGrade(e.value?.title);
    setGradeSearch(e.value?.id);
  };
  const handleYear = (e) => {
    setYear(e.value?.year);
  };
  const dropdownSearch = [
    {
      value: competition,
      onChange: handleCompetition,
      options: competitionList,
      optionLabel: "title",
      placeholder: "Cuộc Thi",
    },
    {
      value: selectedProvince,
      onChange: handleProvince,
      options: provinceList,
      optionLabel: "name",
      placeholder: "Tỉnh",
    },
   
    {
      value: year,
      onChange: handleYear,
      options: yearList,
      optionLabel: "year",
      placeholder: "Năm",
    },
    {
      value: level,
      onChange: handleLevel,
      options: levelList,
      optionLabel: "title",
      placeholder: "Cấp Học ",
    },
    {
      value: grade,
      onChange: handleGrade,
      options: gradeList,
      optionLabel: "title",
      placeholder: "Lớp",
    },
  ];
  return (
    <NotifyProvider>
      <Header />
      <Menu />
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col ">
          <h1 className="ml-8 text-2xl font-bold mb-5 mt-3">Danh Sách Các Đề Thi</h1>
          <div className="w-full flex justify-center gap-10 items-center mx-auto m-4">
            {dropdownSearch.map((config, index) => (
              <div key={index}>
                <Dropdown
                  value={config.value}
                  onChange={config.onChange}
                  options={config.options}
                  optionLabel={config.optionLabel}
                  editable
                  placeholder={config.placeholder}
                  className="border border-gray-500 rounded-xl  shadow-l custom-dropdown"
                  filter
                />
              </div>
            ))}
          </div>

          {examList.length > 0 ? (
            examList
              .map((exam) => (
                <CardExam id={exam.id} title={exam.title} type={exam.type} />
              ))
          ) : (
            <div className="h-screen flex justify-center items-center">
              <p className="text-2xl font-bold text-blue-800">
                Hiện Tại Không Có Đề Thi
              </p>
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
    </NotifyProvider>
  );
};

export default Index;
