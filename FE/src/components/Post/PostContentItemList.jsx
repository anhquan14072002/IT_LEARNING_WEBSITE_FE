import React, { useContext, useState } from "react";

import PostAnswer from "./PostAnswer";
import PostQuestion from "./PostQuestion";
import PostContext from "../../store/PostContext";

function PostContentItemList(props) {
  const { posts } = useContext(PostContext);
  return (
    <div className="flex flex-col gap-3">
      {posts.map((post) => (
        <div
          className="border-stone-200 border-2 flex flex-col rounded"
          key={post.id}
        >
          <PostQuestion post={post} />
          <PostAnswer post={post} key={post.id} />
        </div>
      ))}
    </div>
  );
}

export default PostContentItemList;
