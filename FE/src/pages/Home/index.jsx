import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import Class from "../../components/Class";
import DocumentCard from "../../components/DocumentCard";
import Footer from "../../components/Footer";
import LoadingScreen from "../../components/LoadingScreen";
import { getAllGrade } from "../../services/grade.api";
import {
  getAllDocument,
  getAllDocumentSortByAvg,
} from "../../services/document.api";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import NotifyProvider from "../../store/NotificationContext";
import Slider from "react-slick";
import slide1 from "../../assets/anh1.jpg";
import slide2 from "../../assets/anh2.jpg";
import slide3 from "../../assets/anh3.jpg";
import slide4 from "../../assets/anh4.jpg";
import { useSelector } from "react-redux";
import { isLoggedIn } from "../../utils";
import restClient from "../../services/restClient";

export default function Home() {
  const navigate = useNavigate();
  const fixedDivRef = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const [loading, setLoading] = useState(true);
  const [classList, setListClass] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [loadingGet, setLoadingGet] = useState(false);
  const user = useSelector((state) => state.user.value);

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  useEffect(() => {
    setTimeout(() => {
      if (fixedDivRef.current) {
        setFixedDivHeight(fixedDivRef.current.offsetHeight);
      }
    }, 500);
  }, [fixedDivRef.current]);

  useEffect(() => {
    if (isLoggedIn()) {
      console.log(user);
    }
  }, []);

  useEffect(() => {
    getAllGrade(setLoading, setListClass);
    restClient({
      url: `api/document/getalldocumentpagination?PageSize=5&OrderBy=averageRating&IsAscending=false&Status=true`,
      method: "GET",
    })
      .then((res) => {
        setDocumentList(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setDocumentList([]);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {loading ? (
        <LoadingScreen setLoading={setLoading} />
      ) : (
        <NotifyProvider>
          <div className="min-h-screen">
            <div ref={fixedDivRef} className="fixed top-0 w-full z-10">
              <Header />
              <Menu />
            </div>

              <div
                className="sm:px-20"
                style={{ paddingTop: `${fixedDivHeight}px` }}
              >
                <div className="mt-5">
                  <Slider {...settings}>
                    <div>
                      <img
                        className="w-full h-48 md:h-64 lg:h-80 xl:h-[500px] object-center"
                        src={slide1}
                        alt="Slide"
                      />
                    </div>
                    <div>
                      <img
                        className="w-full h-48 md:h-64 lg:h-80 xl:h-[500px] object-center"
                        src={slide2}
                        alt="Slide"
                      />
                    </div>
                    <div>
                      <img
                        className="w-full h-48 md:h-64 lg:h-80 xl:h-[500px] object-center"
                        src={slide3}
                        alt="Slide"
                      />
                    </div>
                    <div>
                      <img
                        className="w-full h-48 md:h-64 lg:h-80 xl:h-[500px] object-center"
                        src={slide4}
                        alt="Slide"
                      />
                    </div>
                  </Slider>
                </div>

                <h1 className="mt-10 text-2xl font-bold">Bộ sách</h1>
                <div>
                  {classList &&
                    classList?.map((item, i) => {
                      return <Class item={item} index={i} key={i} />;
                    })}
                </div>
              </div>
              <div className="sm:px-20 mt-16 mb-10">
                <h1 className="mt-10 text-2xl font-bold">
                  Tài liệu online cho giáo viên và học sinh
                </h1>
                <div className="my-5 flex flex-wrap justify-between">
                  <h1 className="text-gray-500">
                    Dành cho các học sinh từ lớp 1-12
                  </h1>
                  <h1
                    className="text-blue-500 cursor-pointer"
                    onClick={() => navigate("/search")}
                  >
                    &gt;&gt; Xem tất cả khóa học
                  </h1>
                </div>
              </div>
              <div className="sm:px-20 flex flex-wrap justify-center gap-1">
                {loadingGet ? (
                  <div className="flex justify-center w-full">
                    <Loading />
                  </div>
                ) : (
                  documentList &&
                  documentList.map((document, index) => (
                    <DocumentCard key={index} document={document} />
                  ))
                )}
              </div>

            <Footer />
          </div>
        </NotifyProvider>
      )}
    </>
  );
}
