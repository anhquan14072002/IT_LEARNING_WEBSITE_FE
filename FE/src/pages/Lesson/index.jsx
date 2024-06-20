import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import Footer from "../../components/Footer";
import CategoryOfClass from "../../components/CategoryOfClass";
import DocumentClass from "../../components/DocumentClass";
import Comment from "../../components/Comment";
import LessonInDocument from "../../components/LessonInDocument";

export default function Lesson() {
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
        <LessonInDocument display={isDisplay} />

        <div className="pt-6 flex-1">
          <h1 className="text-xl pb-5">Tail lieu chan troi java</h1>
          <p>
            Java là ngôn ngữ lập trình máy tính có tính chất hướng đối tượng,
            dựa trên các lớp, thường được sử dụng cho các hệ thống có tính độc
            lập cao. Nó được sử dụng để hướng tới các lập trình viên viết ứng
            dụng "write one, run everywhere" (viết một lần, chạy mọi nơi, nghĩa
            là đoạn code Java sau khi được biên dịch có thể chạy được trên tất
            cả các nền tảng hỗ trợ Java mà không cần phải được biên dịch lại.
            Các ứng dụng Java sau khi đã được biên dịch thành bytecode có thể
            chạy trên bất kỳ máy ảo Java nào (Java virtual machine) Cho đến năm
            2018, Java là một trong những ngôn ngữ được dùng phổ biến nhất trên
            thế giới, đặc biệt cho các úng dựng web client- server. Theo thống
            kê trên thế giới có khoảng 9 triệu lập trình viên Java Các bạn ở Hà
            Nội có thể xem các bạn khóa 6 được học gì, các bạn khóa 7 (đang
            tuyển sinh đến ngày 20/06) sẽ làm lớn hơn các project nhé Video một
            phần các dự án khóa 6 Các bạn ở xa học không có điều kiện thời gian
            có thể tham dự khóa Java online để chủ động cho việc học tập. Trong
            năm 2018, giá khóa học chỉ còn 200k, liên hệ facebook admin
            fb.com/tuyen.vietjack để thanh toán chuyển khoản hoặc thẻ điện
            thoại, khóa học bằng Tiếng Việt với gần 100 video, các bạn có thể
            chủ động bất cứ lúc nào, và xem mãi mãi. Thông tin khóa học tại Khóa
            học Java Online trên Udemy VietJackTeam sẽ hỗ trợ cho mọi người 8
            videos miễn phí cho các bạn xem thử để các bạn quyết định nên tham
            gia khóa online hay offline tại Hà Nội hay không. Các bạn có thể xem
            tại địa chỉ Video demo Giới thiệu khóa học Regular Expression trong
            Java, cách validate email và cách trường đặc biệt. Vòng lặp for
            trong Java, với các bài toán in hình đặc biệt Constructor 2- Thực
            hành quản lý tài khoản ngân hàng. Package, cách tạo file Jar, import
            file Jar trong Java. Xử lý BLOB data (cách ghi dữ liệu file vào
            Database) trong JDBC Collection Set trong Java, ý nghĩa hàm hashCode
            và equals trong Java Collection trong Java- Thực hành bài tập quản
            lý việc đặt ghế trong rạp phim.
          </p>
        </div>
      </div>

      <Footer ref={displayRef} />
    </div>
  );
}
