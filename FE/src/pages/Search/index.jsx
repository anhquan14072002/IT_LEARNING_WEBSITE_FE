import React, { useEffect, useRef, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import CategoryOfClass from "../../components/CategoryOfClass";
import CustomCard from "../../components/CustomCard";
import { Paginator } from "primereact/paginator";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "./index.css";
import { Dropdown } from "primereact/dropdown";

export default function Search() {
  const footerRef = useRef(null);
  const fixedDivRef = useRef(null);
  const dropDownRef1 = useRef(null);
  const dropDownRef2 = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsFooterVisible(true);
          } else {
            setIsFooterVisible(false);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  useEffect(() => {
    if (dropDownRef1.current) {
      setFixedDivHeight(dropDownRef1.current.offsetHeight);
    }
    if (dropDownRef2.current) {
      setFixedDivHeight(dropDownRef2.current.offsetHeight);
    }
  }, [dropDownRef1, dropDownRef2]);

  useEffect(() => {
    if (fixedDivRef.current) {
      setFixedDivHeight(fixedDivRef.current.offsetHeight);
    }
  }, [fixedDivRef]);

  return (
    <>
      <div className="min-h-screen">
        <div ref={fixedDivRef} className="fixed top-0 w-full z-10">
          <Header />
          <Menu />
        </div>
        <div
          style={{ paddingTop: `${fixedDivHeight}px` }}
          className="flex gap-5"
        >
          <CategoryOfClass display={isFooterVisible} />
          <div className="flex-1 w-[98%] pt-5">
            <div className="m-4 mb-10 flex flex-wrap items-center">
              <div className="border-2 rounded-md p-2">
                <InputText
                  placeholder="Search"
                  className="flex-1 focus:outline-none w-36 focus:ring-0"
                />
                <Button
                  icon="pi pi-search"
                  className="p-button-warning focus:outline-none focus:ring-0 flex-shrink-0"
                />
              </div>

              <div className="flex-1 flex gap-3 justify-end">
                <div className="border-2 rounded-md mt-4">
                  <Dropdown
                    filter
                    ref={dropDownRef1}
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.value)}
                    options={cities}
                    optionLabel="name"
                    showClear
                    placeholder="Thể loại"
                    className="w-full md:w-14rem shadow-none h-full"
                  />
                </div>
                <div className="border-2 rounded-md mt-4">
                  <Dropdown
                    filter
                    ref={dropDownRef2}
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.value)}
                    options={cities}
                    optionLabel="name"
                    showClear
                    placeholder="Tài liệu"
                    className="w-full md:w-14rem shadow-none h-full"
                  />
                </div>
              </div>
            </div>
            <div className="m-4">
              <h1>
                Có <span className="text-blue-700 underline">15</span> kết quả
                tìm kiếm
              </h1>
            </div>
            <CustomCard />
            <CustomCard />
            <CustomCard />
            <CustomCard />
            <CustomCard />
            <Paginator
              first={first}
              rows={rows}
              totalRecords={120}
              onPageChange={onPageChange}
              className="custom-paginator mx-auto"
            />
          </div>
        </div>
      </div>
      <Footer ref={footerRef} />
    </>
  );
}
