import React, { useEffect, useRef, useState } from "react";
import PostGrade from "../../components/Post/PostGrade";
import PostContent from "../../components/Post/PostContent";
import PostRank from "../../components/Post/PostRank";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import Footer from "../../components/Footer";
import { PostProvider } from "../../store/PostContext";
import NotifyProvider from "../../store/NotificationContext";

function Post(props) {
  const fixedDivRef = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const displayRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      if (fixedDivRef.current) {
        setFixedDivHeight(fixedDivRef.current.offsetHeight);
      }
    }, 500);
  }, [fixedDivRef]);

  return (
    <>
      <NotifyProvider>
        <PostProvider>
          <div className="min-h-screen flex flex-col">
            <div ref={fixedDivRef} className="fixed top-0 w-full z-10">
              <Header />
              <Menu />
            </div>
            <div
              style={{ paddingTop: `${fixedDivHeight}px` }}
              className="flex flex-col md:flex-row gap-3 p-3"
            >
              {/* <div className="lg:w-[17%]"> */}
              <PostGrade />
              {/* </div> */}

              {/* <div className="lg:flex-1"> */}
              <PostContent />
              {/* </div> */}
            </div>
          </div>
          <Footer />
        </PostProvider>
      </NotifyProvider>
    </>
  );
}

export default Post;
