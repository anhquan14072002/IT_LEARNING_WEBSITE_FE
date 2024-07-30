import React, { useContext, useEffect, useState } from "react";
import { getAllGrade } from "../../services/grade.api";
import LoadingScreen from "../LoadingScreen";
import PostGradeItem from "./PostIGradetem";
import PostContext from "../../store/PostContext";
import "./post.css";
function PostGrade(props) {
  const { setLoading, classList, loading, itemSidebar, setItemSidebar } =
    useContext(PostContext);

  return (
    <>
      {loading ? (
        <LoadingScreen setLoading={setLoading} />
      ) : (
        <div
          className="w-[17%] h-screen fixed top-[9rem] bottom-0 overflow-y-auto hide-scrollbar"
          style={{ height: "calc(100vh - 9rem)" }}
        >
          {classList &&
            classList?.map((item, i) => {
              return (
                <PostGradeItem
                  key={item.id}
                  item={item}
                  active={itemSidebar.itemSelected === item.id}
                  onClick={() =>
                    setItemSidebar((preValue) => {
                      return { itemSelected: item.id };
                    })
                  }
                />
              );
            })}
        </div>
      )}
    </>
  );
}

export default PostGrade;
