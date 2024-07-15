import { Button } from "primereact/button";
import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import help from "../../assets/img/icons8-help-30.png";
import arrows from "../../assets/img/arrows.png";
import back from "../../assets/img/icons8-back-50.png";
import cancel from "../../assets/img/icons8-cancel-24.png";
import FormDataContext from "../../store/FormDataContext";
function IconButton({ icon, title, ...props }) {
  return (
    <Button className="border border-[#c5c7c7] py-1 px-3 mt-1" {...props}>
      <img src={icon} width="25" height="25" className="mr-1" />
      {title}
    </Button>
  );
}
function Footer({ Menus }) {
  const location = useLocation();
  const navigate = useNavigate();

  const locationSplit = location.pathname.split("/")[2];
  const indexRoute = Menus.findIndex((menu) => menu.path === locationSplit);
  const { success, step } = useContext(FormDataContext);
  function implement() {
    const nextRoute = Menus[indexRoute + 1].path;
    navigate(nextRoute);
  }
  function backRoute() {
    /* solution: Where is the origin of action from ? 
          -  w*/
    let nextRoute =
      indexRoute === 0 ? "/dashboard" : Menus[indexRoute - 1].path;
    console.log(nextRoute);
    navigate(nextRoute);
  }
  return (
    <footer className="flex justify-between  mt-2">
      <Button
        className="border border-[#c5c7c7] py-1 px-3"
        tooltip="1. Tải mẫu excel để nhập khẩu tại link màu xanh 'Tại đây'
          2. Ấn nút Chọn và chọn tải liệu muốn nhập khẩu
          3. Ấn nút Thực hiện dưới màn hình 
          4. Kiểm tra những dữ liệu muốn nhập khẩu vào hệ thống
          5. Ấn nút Thực hiện dưới màn hình để Nhập khẩu vào hệ thống
          6. Ấn nút Hủy bỏ để Thoát"
        tooltipOptions={{ position: "top" }}
      >
        <img src={help} width="25" height="25" className="mr-1" />
        Giúp
      </Button>
      <span className="flex gap-4">
        {indexRoute != 2 && (
          <IconButton icon={back} title="Quay lại" onClick={backRoute} />
        )}
        {indexRoute != 2 && (
          <IconButton
            icon={arrows}
            title="Thực hiện"
            onClick={implement}
            disabled={success == 0 && step == "stepTwo"}
          />
        )}
        <IconButton
          icon={cancel}
          title="Hủy bỏ"
          onClick={() => navigate("/dashboard")}
        />
      </span>
    </footer>
  );
}

export default Footer;
