import React from "react";
import PostGrade from "../../layouts/post/PostGrade";
import PostContent from "../../layouts/post/PostContent";
import PostRank from "../../components/Post/PostRank";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import { PostProvider } from "../../store/PostContext";
import NotifyProvider from "../../store/NotificationContext";

function Post(props) {
  return (
    <NotifyProvider>
      <PostProvider>

        <Header />
        <Menu />
        <div className="flex gap-3 p-3">
          <PostGrade />
          <PostContent />
          {/* <PostRank></PostRank> */}
        </div>
      </PostProvider>
    </NotifyProvider>

    // ấn vào thì reset total comment (total comment là những tin nhắn vừa mới được gửi thông báo đến )
    // 0 chưa đọc
    // 1 đã 
  );
}

export default Post;
