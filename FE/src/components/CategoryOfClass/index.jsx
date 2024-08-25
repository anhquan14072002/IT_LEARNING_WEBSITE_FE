import React, { useEffect, useState } from "react";
import restClient from "../../services/restClient";
import Loading from "../Loading";
import { useNavigate, useLocation } from "react-router-dom";

export default function CategoryOfClass({ display, params, setParams, setPage }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [listClast, setListClass] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null); 

  useEffect(() => {
    setLoading(true);
    restClient({
      url: `api/grade/getallgrade?isInclude=false`,
      method: "GET",
    })
      .then((res) => {
        setListClass(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setListClass([]);
        setLoading(false);
      });
  }, []);

  // Update selectedClassId when classId changes in URL query parameters
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    const urlClassId = urlSearchParams.get("classId");

    if (urlClassId && !isNaN(urlClassId)) {
      setSelectedClassId(parseInt(urlClassId, 10)); 
    } else {
      setSelectedClassId(null);
    }
  }, [location.search]);

  const handleClick = (classId) => {
    if (selectedClassId === classId) {
      setSelectedClassId(null);
      setPage(1)
      const updatedParams = { ...Object.fromEntries(params.entries()) };
      delete updatedParams.classId;
      setParams(updatedParams);
    } else {
      setPage(1)
      setSelectedClassId(classId);
      setParams({ ...Object.fromEntries(params.entries()), classId });
    }
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div
            className={`fixed w-[15%] ${
              display
                ? "transition duration-200 ease-in-out hidden"
                : "transition duration-200 ease-in-out block"
            }`}
          >
            <h1 className="font-bold text-xl pt-2 pl-2">Danh mục các lớp</h1>
            <div className="overflow-y-auto h-[75vh] custom-scrollbar">
              {listClast &&
                listClast.map((clast, index) => (
                  <div
                    key={index}
                    onClick={() => handleClick(clast.id)}
                    className={`p-2 cursor-pointer w-full ${
                      selectedClassId === clast.id
                        ? "bg-[#D1F7FF] hover:bg-[#D1F7FF]"
                        : "hover:bg-[#D1F7FF]"
                    }`}
                  >
                    {clast.title}
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
