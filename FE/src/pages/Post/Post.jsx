import React from "react";
import PostGrade from "../../components/Post/PostGrade";
import PostContent from "../../components/Post/PostContent";
import PostRank from "../../components/Post/PostRank";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import { PostProvider } from "../../store/PostContext";

function Post(props) {
  return (
    <PostProvider>
      <Header />
      <Menu />
      <div className="flex gap-3 p-4">
        <PostGrade />
        <PostContent />
        {/* <PostRank></PostRank> */}
      </div>
    </PostProvider>
  );
}

export default Post;
