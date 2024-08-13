import React, { useContext, useEffect, useState } from "react";
import LoadingScreen from "../../components/LoadingScreen";
import PostGradeItem from "../../components/Post/PostIGradetem";
import PostContext from "../../store/PostContext";
import { getAllGrade } from "../../services/grade.api";

function PostGrade(props) {
  const { itemSidebar, setItemSidebar } = useContext(PostContext);
  const [loading, setLoading] = useState(true);
  const [classList, setListClass] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State to manage sidebar visibility on small screens

  useEffect(() => {
    getAllGrade(setLoading, setListClass);
  }, []);

  return (
    <>
      {loading ? (
        <LoadingScreen setLoading={loading} />
      ) : (

        <>
          {/* Icon for toggling sidebar on small screens */}
          <div className="md:hidden flex justify-end">
            <i
              className="pi pi-align-justify"
              style={{ fontSize: "2rem", color: "#e0e0e0" }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            ></i>
          </div>

          {/* Sidebar - visible on large screens, hidden on small screens */}
          <div
            className={`${
              sidebarOpen ? "block" : "hidden"
            } md:block w-full md:w-[17%] `}
          >
            {classList &&
              classList?.map((item, i) => {
                return (
                  <PostGradeItem
                    key={item.id}
                    item={item}
                    active={itemSidebar.gradeIdSelected === item.id}
                    onClick={() =>
                      setItemSidebar((preValue) => {
                        return { ...preValue, gradeIdSelected: item.id };
                      })
                    }
                  />
                );
              })}
          </div>
        </>
      )}
    </>
  );
}

export default PostGrade;
