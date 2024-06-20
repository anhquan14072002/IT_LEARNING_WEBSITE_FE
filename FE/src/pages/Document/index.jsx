import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import Footer from "../../components/Footer";
import CategoryOfClass from "../../components/CategoryOfClass";
import DocumentClass from "../../components/DocumentClass";
import Comment from "../../components/Comment";

export default function Document() {
  const fixedDivRef = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const [isDisplay, setIsDisplay] = useState(false);
  const displayRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsDisplay(true);
          } else {
            setIsDisplay(false);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    if (displayRef.current) {
      observer.observe(displayRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (fixedDivRef.current) {
      setFixedDivHeight(fixedDivRef.current.offsetHeight);
    }
  }, [fixedDivRef]);

  return (
    <div className="min-h-screen flex flex-col">
      <div ref={fixedDivRef} className="fixed top-0 w-full z-10">
        <Header />
        <Menu />
      </div>
      <div style={{ paddingTop: `${fixedDivHeight}px` }} className="flex gap-5">
        <DocumentClass display={isDisplay} />

        <div className="pt-6 flex-1">
          <h1 className="font-bold text-lg pb-5">Tail lieu chan troi java</h1>
          <div className="mb-2">
            <h1 className="pl-1 font-semibold">
              Chủ đề 1 : Tail lieu chan troi java
            </h1>
            <h1 className="pl-5">
              Bài 1 : Tail lieu chan tail lieu chan troi java
            </h1>
            <h1 className="pl-5">Bài 1 : Tail lieu chan troi java</h1>
            <h1 className="pl-5">Bài 1 : Tail lieu chan troi java</h1>
            <h1 className="pl-5">Bài 1 : Tail lieu chan troi java</h1>
            <h1 className="pl-5">Bài 1 : Tail lieu chan troi java</h1>
            <h1 className="pl-5">Bài 1 : Tail lieu chan troi java</h1>
          </div>
          <div className="mb-2">
            <h1 className="pl-1 font-semibold">
              Chủ đề 1 : Tail lieu chan troi java
            </h1>
            <h1 className="pl-5">Bài 1 : Tail lieu chan troi java</h1>
            <h1 className="pl-5">Bài 1 : Tail lieu chan troi java</h1>
            <h1 className="pl-5">Bài 1 : Tail lieu chan troi java</h1>
            <h1 className="pl-5">Bài 1 : Tail lieu chan troi java</h1>
            <h1 className="pl-5">Bài 1 : Tail lieu chan troi java</h1>
            <h1 className="pl-5">Bài 1 : Tail lieu chan troi java</h1>
          </div>
          <div className="mb-2">
            <h1 className="pl-1 font-semibold">
              Chủ đề 1 : Tail lieu chan troi java
            </h1>
            <h1 className="pl-5">Bài 1 : Tail lieu chan troi java</h1>
            <h1 className="pl-5">Bài 1 : Tail lieu chan troi java</h1>
            <h1 className="pl-5">Bài 1 : Tail lieu chan troi java</h1>
            <h1 className="pl-5">Bài 1 : Tail lieu chan troi java</h1>
            <h1 className="pl-5">Bài 1 : Tail lieu chan troi java</h1>
            <h1 className="pl-5">Bài 1 : Tail lieu chan troi java</h1>
          </div>
          <div className="mb-2">
            <h1 className="pl-1 font-semibold">
              Chủ đề 1 : Tail lieu chan troi java
            </h1>
            <h1 className="pl-5">Bài 1 : Tail lieu chan troi java</h1>
            <h1 className="pl-5">Bài 1 : Tail lieu chan troi java</h1>
            <h1 className="pl-5">Bài 1 : Tail lieu chan troi java</h1>
            <h1 className="pl-5">Bài 1 : Tail lieu chan troi java</h1>
            <h1 className="pl-5">Bài 1 : Tail lieu chan troi java</h1>
            <h1 className="pl-5">Bài 1 : Tail lieu chan troi java</h1>
          </div>

          {/* comment */}
          <Comment />
        
        </div>
      </div>

      <Footer ref={displayRef} />
    </div>
  );
}
