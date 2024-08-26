// FormDataContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import restClient, { BASE_URL } from "../services/restClient";
import {
  ACCEPT,
  getTokenFromLocalStorage,
  isLoggedIn,
  REJECT,
  SUCCESS,
} from "../utils";
import { Toast } from "primereact/toast";
import { useSelector } from "react-redux";
import {
  HttpTransportType,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { NotificationContext } from "./NotificationContext";
import { useParams } from "react-router-dom";
const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [postCommentChilds, setPostCommentChilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const user = useSelector((state) => state.user.value);
  const [itemSidebar, setItemSidebar] = useState({
    gradeIdSelected: undefined,
    itemTab: undefined,
  });
  const [compose, setCompose] = useState({ isCompose: false, data: null });
  const toast = useRef(null);
  const [refresh, setRefresh] = useState();
  const [refresh2, setRefresh2] = useState();
  const [conn, setConnection] = useState();
  const [isConnect, setIsConnect] = useState(false);
  const [listNotification, setListNotification] = useState(false);
  const hasFetched = useRef(false);
  const isCheck = isLoggedIn();
  const { fetchNumberNotificationByUserId } = useContext(NotificationContext);
  const { id } = useParams();
  useEffect(() => {
    // if (hasFetched.current) return; // Prevent fetching if already done
    const notification = async () => {
      try {
        const conn = new HubConnectionBuilder()
          .withUrl(`${BASE_URL}/notificationHub`, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets,
          })
          .configureLogging(LogLevel.Information)
          .build();
        conn.on("ReceivedNotification", (message) => {
          // SUCCESS(toast, message);
          setRefresh(new Date());
          setRefresh2(new Date());
          fetchNumberNotificationByUserId();
        });

        conn.on(
          "ReceivedPersonalNotification",
          (message, userReceiveId, userSendId) => {
            if (userReceiveId !== userSendId) {
              fetchNumberNotificationByUserId();
            }
            setRefresh(new Date());
            setRefresh2(new Date());
          }
        );
        conn.onclose(() => {
          setConnection(null);
          setIsConnect(false);
          setListNotification([]);
        });

        await conn.start();
        setConnection(conn);
        setIsConnect(true);

        await conn.invoke("SaveUserConnection", user?.sub);
      } catch (error) {
        console.error("Connection failed: ", error);
      }
    };
    if (user?.sub && isCheck) {
      notification();
    }
    // hasFetched.current = true; // Mark fetch as done
    return () => {
      if (conn) {
        conn.stop();
      }
    };
  }, [user?.sub, isCheck, fetchNumberNotificationByUserId]);

  const createPostNotification = (contentPost) => {
    restClient({
      url: "api/notifications/createnotificationpersonal",
      method: "POST",
      data: contentPost,
    })
      .then((res) => {
        // SUCCESS(toast, "Bình luận bài đăng thành công");
        // fetchPost();
        setLoading(false);
      })
      .catch((err) => {
        REJECT(toast, err.message);
        setLoading(false);
      });
  };
  useEffect(() => {
    if (
      itemSidebar.itemTab === undefined &&
      itemSidebar.gradeIdSelected === undefined
    ) {
      if (id == 0 || !id) {
        fetchData();
      } else {
        fetchPostDetailById();
      }
    } else if (itemSidebar.itemTab === "myQuestion") {
      fetchDataByUserId();
    } else if (itemSidebar.itemTab === "notAnswer") {
      fetchDataByNotAnswer();
    } else if (itemSidebar.itemTab === "goodQuestion") {
      fetchFavoriteByUserId();
    } else if (itemSidebar.gradeIdSelected !== undefined) {
      fetchDataById();
    }
  }, [
    page,
    rows,
    itemSidebar.itemTab,
    itemSidebar.gradeIdSelected,
    refresh2,
    id,
  ]);
  const fetchDataByUserId = () => {
    setLoading(true);
    let url;
    if (itemSidebar?.gradeIdSelected) {
      url = `api/post/getallpostbyuserandgradepagination?userId=${user?.sub}&gradeId=${itemSidebar?.gradeIdSelected}&PageIndex=${page}&PageSize=${rows}&OrderBy=createdDate&IsAscending=false`;
    } else {
      url = `api/post/getallpostbyuserpagination?userId=${user?.sub}&PageIndex=${page}&PageSize=${rows}&OrderBy=createdDate&IsAscending=false`;
    }
    restClient({
      url: url,
      method: "GET",
    })
      .then((res) => {
        setPosts(Array.isArray(res.data.data) ? res.data.data : []);
        const paginationData = JSON.parse(res.headers["x-pagination"]);
        setTotalPage(paginationData.TotalPages);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  };
  const fetchDataByNotAnswer = () => {
    setLoading(true);
    let url;
    if (itemSidebar?.gradeIdSelected) {
      url = `api/post/getallpostnotanswerbygradepagination?gradeId=${itemSidebar?.gradeIdSelected}&PageIndex=${page}&PageSize=${rows}&OrderBy=createdDate&IsAscending=false`;
    } else {
      url = `api/post/getallpostnotanswerbygradepagination?gradeId=0&PageIndex=${page}&PageSize=${rows}&OrderBy=createdDate&IsAscending=false`;
    }
    restClient({
      url: url,
      method: "GET",
    })
      .then((res) => {
        setPosts(Array.isArray(res.data.data) ? res.data.data : []);
        const paginationData = JSON.parse(res.headers["x-pagination"]);
        setTotalPage(paginationData.TotalPages);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  };
  const fetchDataById = () => {
    setLoading(true);
    restClient({
      url: `api/post/getallpostbygradepagination?gradeId=${itemSidebar.gradeIdSelected}&PageIndex=${page}&PageSize=${rows}&OrderBy=createdDate&IsAscending=false`,
      method: "GET",
    })
      .then((res) => {
        setPosts(Array.isArray(res.data.data) ? res.data.data : []);
        const paginationData = JSON.parse(res.headers["x-pagination"]);
        setTotalPage(paginationData.TotalPages);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  };
  const fetchPostById = (id) => {
    setLoading(true);
    restClient({
      url: `api/post/getpostbyid?id=${id}`,
      method: "GET",
    })
      .then((res) => {
        setCompose((preValue) => ({
          isCompose: true,
          data: { ...res.data.data, idPost: id },
        }));
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      })
      .finally(() => setLoading(false));
  };

  const fetchFavoriteByUserId = () => {
    setLoading(true);
    restClient({
      url: `api/post/getallfavoritepostbyuserpagination?userId=${user?.sub}&PageIndex=${page}&PageSize=${rows}`,
      method: "GET",
    })
      .then((res) => {
        setPosts(Array.isArray(res.data.data) ? res.data.data : []);
        const paginationData = JSON.parse(res.headers["x-pagination"]);
        setTotalPage(paginationData.TotalPages);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  };
  const fetchPostCommentById = (id) => {
    setLoading(true);
    restClient({
      url: `api/post/getpostcommentbyid/${id}`,
      method: "GET",
    })
      .then((res) => {
        setPostCommentChilds(Array.isArray(res.data.data) ? res.data.data : []);
        const paginationData = JSON.parse(res.headers["x-pagination"]);
        setTotalPage(paginationData.TotalPages);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setPostCommentChilds([]);
      })
      .finally(() => setLoading(false));
  };
  const deletePost = async (id) => {
    await restClient({
      url: `api/post/deletepost/${id}`,
      method: "DELETE",
    })
      .then((res) => {
        // SUCCESS(toast, "Thu hôi bài post thành công");
        setRefresh2(new Date());
      })
      .catch((err) => {
        REJECT(toast, "Xảy ra lỗi khi xóa bài đăng");
      });
  };
  const deletePostComment = async (id, fetchPost) => {
    await restClient({
      url: `api/postcomment/deletepostcomment/${id}`,
      method: "DELETE",
    })
      .then((res) => {
        SUCCESS(toast, "Thu hôi bình luận thành công");
        fetchPost();
      })
      .catch((err) => {
        REJECT(toast, "Xảy ra lỗi khi xóa bình luận");
      });
  };
  const fetchData = () => {
    setLoading(true);
    restClient({
      url: `api/post/getallpostpagination?PageIndex=${page}&PageSize=${rows}&OrderBy=createdDate&IsAscending=false`,
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
  const fetchPostDetailById = () => {
    setLoading(true);
    restClient({
      url: `api/post/getpostbyid?id=${id}`,
      method: "GET",
    })
      .then((res) => {
        setPosts([res.data.data]);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  };

  const createPost = async (contentPost) => {
    try {
      // Set loading state to true before making the request
      setLoading(true);

      // Make the API call using restClient
      const res = await restClient({
        url: "api/post/createpost",
        method: "POST",
        data: contentPost,
      });
      // Refresh the UI by updating state
      setRefresh2(new Date());
      // Return the result data; this will return a promise
      return res.data.data;
    } catch (err) {
      // Handle errors
      REJECT(toast, err.message);
      throw err; // Re-throw error to be handled by the caller
    } finally {
      // Set loading state to false, regardless of success or error
      setLoading(false);
    }
  };

  const updatePost = (contentPost) => {
    restClient({
      url: "api/post/updatePost",
      method: "PUT",
      data: contentPost,
    })
      .then((res) => {
        // SUCCESS(toast, "Tạo bài post thành công");
        setRefresh2(new Date());
        setLoading(false);
      })
      .catch((err) => {
        REJECT(toast, err.message);
        setLoading(false);
      });
  };

  const createFavoritePost = (postId) => {
    // ?userId=1&postId=2
    restClient({
      url: `api/post/votefavoritepost?userId=${user?.sub}&postId=${postId}`,
      method: "POST",
    })
      .then((res) => {
        // SUCCESS(toast, "Thích bài post thành công");
        setRefresh2(new Date());
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
        setLoading(false);
        // fetchPost();
        setRefresh(new Date());
        setRefresh2(new Date());
      })
      .catch((err) => {
        REJECT(toast, err.message);
        setLoading(false);
      });
  };
  const updatePostComment = (contentPost, fetchPost) => {
    restClient({
      url: "api/postcomment/updatepostcomment",
      method: "PUT",
      data: contentPost,
    })
      .then((res) => {
        SUCCESS(toast, "Sửa bài đăng thành công");
        setLoading(false);
        fetchPost();
      })
      .catch((err) => {
        REJECT(toast, err.message);
        setLoading(false);
      });
  };
  const createResponseAnswer = (contentPost, fetchPost) => {
    restClient({
      url: "api/postcomment/createpostcomment",
      method: "POST",
      data: contentPost,
    })
      .then((res) => {
        SUCCESS(toast, "Phản hồi câu trả lời thành công");
        fetchPost();
        setLoading(false);
      })
      .catch((err) => {
        REJECT(toast, err.message);
        setLoading(false);
      });
  };
  const createVoteComment = (id, isLike, fetchPost) => {
    let text = isLike ? "thích" : "không thích";
    restClient({
      url: `api/postcomment/votepostcomment?commentId=${id}&userId=${user?.sub}`,
      method: "POST",
    })
      .then((res) => {
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

  const checkUser = () => {
    if (!user?.sub || !isLoggedIn()) {
      // có user?.sub và token hết hạn
      ACCEPT(toast, "Bạn chưa đăng nhập ?");
      return false;
    }
    return true;
  };
  return (
    <PostContext.Provider
      value={{
        loading,
        setLoading,
        setPosts,
        posts,
        first,
        rows,
        page,
        setRefresh,
        refresh,
        itemSidebar,
        setItemSidebar,
        onPageChange,
        postCommentChilds,
        totalPage,
        createPost,
        createPostComment,
        createVoteComment,
        createResponseAnswer,
        deletePost,
        checkUser,
        deletePostComment,
        fetchPostCommentById,
        createPostNotification,
        createFavoritePost,
        setCompose,
        compose,
        fetchPostById,
        updatePost,
        updatePostComment,
      }}
    >
      <Toast ref={toast} />
      {children}
    </PostContext.Provider>
  );
};

export default PostContext;
