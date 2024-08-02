// FormDataContext.js
import React, { createContext, useEffect, useRef, useState } from "react";
import restClient from "../services/restClient";
import { ACCEPT, REJECT, SUCCESS } from "../utils";
import { Toast } from "primereact/toast";
import { useSelector } from "react-redux";
import {
  HttpTransportType,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const user = useSelector((state) => state.user.value);
  const [itemSidebar, setItemSidebar] = useState({
    itemSelected: undefined,
  });
  const toast = useRef(null);
  const [refresh, setRefresh] = useState();
  const [conn, setConnection] = useState();
  const [isConnect, setIsConnect] = useState(false);
  const [listNotification, setListNotification] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    // if (hasFetched.current) return; // Prevent fetching if already done
    const notification = async () => {
      try {
        const conn = new HubConnectionBuilder()
          .withUrl("https://localhost:7000/notificationHub", {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets,
          })
          .configureLogging(LogLevel.Information)
          .build();
        conn.on("ReceivedNotification", (message) => {
          SUCCESS(toast, message);
        });

        conn.on(
          "ReceivedPersonalNotification",
          (message, userReceiveId, userSendId) => {
            console.log(userReceiveId, userSendId);
            if (userReceiveId !== userSendId) {
              //23b457e4-76ce-431e-9232-d53a090418ca  23b457e4-76ce-431e-9232-d53a090418ca  23b457e4-76ce-431e-9232-d53a090418ca
              console.log(1234);
              SUCCESS(toast, message);
              setRefresh(new Date());
            }
            // }
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

        console.log(conn); // Logging the connection object
      } catch (error) {
        console.error("Connection failed: ", error);
      }
    };
    notification();
    // hasFetched.current = true; // Mark fetch as done
    return () => {
      if (conn) {
        conn.stop();
      }
    };
  }, [user]);

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
    // conn.on("Send", (username, msg) => {
    //   console.log("msg" + username + msg);
    //   setMessage((messages) => [...messages, { username, msg }]);
    // });
  };
  useEffect(() => {
    if (itemSidebar.itemSelected === undefined) {
      fetchData();
    } else if (itemSidebar.itemSelected === "myQuestion") {
      fetchDataByUserId();
    } else if (itemSidebar.itemSelected !== undefined) {
      fetchDataById();
    }
  }, [page, rows, itemSidebar.itemSelected, refresh]);
  const fetchDataByUserId = () => {
    setLoading(true);
    restClient({
      url: `api/post/getallpostbyuserpagination?userId=${user?.sub}&PageIndex=${page}&PageSize=${rows}`,
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
      url: `api/post/getallpostbygradepagination?gradeId=${itemSidebar.itemSelected}&PageIndex=${page}&PageSize=${rows}`,
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
  const fetchPostCommentById = () => {
    setLoading(true);
    restClient({
      url: `api/post/getpostcommentbyid/`,
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
  const deletePost = async (id) => {
    await restClient({
      url: `api/post/deletepost/${id}`,
      method: "DELETE",
    })
      .then((res) => {
        SUCCESS(toast, "Thu hôi bài post thành công");
        setRefresh(new Date());
      })
      .catch((err) => {
        REJECT(toast, "Xảy ra lỗi khi xóa đề thi này");
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
        REJECT(toast, "Xảy ra lỗi khi xóa đề thi này");
      });
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
        setRefresh(new Date());
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
  const createVoteComment = (id, fetchPost) => {
    // ?commentId=46&userId=9418ea16-370b-44e2-910c-9f0d2f50be7f'
    restClient({
      url: `api/postcomment/votepostcomment?commentId=${id}`,
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

  const checkUser = () => {
    if (!user?.sub) {
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
      }}
    >
      <Toast ref={toast} />
      {children}
    </PostContext.Provider>
  );
};

export default PostContext;
