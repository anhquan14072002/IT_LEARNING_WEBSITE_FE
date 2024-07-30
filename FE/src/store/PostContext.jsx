// FormDataContext.js
import React, { createContext, useEffect, useRef, useState } from "react";
import { getAllGrade } from "../services/grade.api";
import restClient from "../services/restClient";
import { SUCCESS } from "../utils";
import { Toast } from "primereact/toast";
const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [classList, setListClass] = useState([]);
  const [posts, setPosts] = useState([]);
  // Pagination
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [itemSidebar, setItemSidebar] = useState({
    itemSelected: undefined,
  });
  const toast = useRef(null);
  useEffect(() => {
    if (itemSidebar.itemSelected === undefined) {
      fetchData();
    }
    if (itemSidebar.itemSelected !== undefined) {
      fetchDataById();
    }
  }, [page, rows, itemSidebar.itemSelected]);
  const fetchDataById = () => {
    setLoading(true);
    restClient({
      url: `api/post/getallpostbygrade/${itemSidebar.itemSelected}`,
      method: "GET",
    })
      .then((res) => {
        setPosts(Array.isArray(res.data.data) ? res.data.data : []);
        // const paginationData = JSON.parse(res.headers["x-pagination"]);
        setTotalPage(res.data.data.length / 10);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  };
  const fetchData = () => {
    setLoading(true);
    restClient({
      url: `api/post/getallpostpagination?PageIndex=${page}&PageSize=${rows}`,
      method: "GET",
    })
      .then((res) => {
        const paginationData = JSON.parse(res.headers["x-pagination"]);
        setTotalPage(paginationData.TotalPages);
        setPosts(Array.isArray(res.data.data) ? res.data.data : []);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  };
  const createPost = (contentPost) => {
    restClient({
      url: "api/post/createpost",
      method: "POST",
      data: contentPost,
    })
      .then((res) => {
        SUCCESS(toast, "Tạo bài post thành công");
        fetchData();
        setLoading(false);
      })
      .catch((err) => {
        REJECT(toast, err.message);
        setLoading(false);
      });
  };
  const createPostComment = (contentPost, fetchPost) => {
    restClient({
      url: "api/postcomment/createpostcomment",
      method: "POST",
      data: contentPost,
    })
      .then((res) => {
        SUCCESS(toast, "Bình luận bài đăng thành công");
        fetchPost();
        setLoading(false);
      })
      .catch((err) => {
        REJECT(toast, err.message);
        setLoading(false);
      });
  };
  const createResponseAnswer = (contentPost) => {
    restClient({
      url: "api/postcomment/createpostcomment",
      method: "POST",
      data: contentPost,
    })
      .then((res) => {
        SUCCESS(toast, "Phản hồi câu trả lời thành công");
        // fetchPost();
        setLoading(false);
      })
      .catch((err) => {
        REJECT(toast, err.message);
        setLoading(false);
      });
  };
  const createVoteComment = (id, fetchPost) => {
    restClient({
      url: `api/postcomment/votepostcomment/${id}`,
      method: "POST",
    })
      .then((res) => {
        SUCCESS(toast, "Bạn đã vote thành công");
        fetchPost();
        setLoading(false);
      })
      .catch((err) => {
        REJECT(toast, err.message);
        setLoading(false);
      });
  };
  const onPageChange = (event) => {
    const { page, rows, first } = event;
    setRows(rows);
    setPage(page + 1);
    setFirst(first);
  };
  useEffect(() => {
    getAllGrade(setLoading, setListClass);
  }, []);

  return (
    <PostContext.Provider
      value={{
        classList,
        loading,
        setLoading,
        setPosts,
        posts,
        first,
        rows,
        page,
        itemSidebar,
        setItemSidebar,
        onPageChange,
        totalPage,
        createPost,
        createPostComment,
        createVoteComment,
        createResponseAnswer,
      }}
    >
      <Toast ref={toast} />
      {children}
    </PostContext.Provider>
  );
};

export default PostContext;
