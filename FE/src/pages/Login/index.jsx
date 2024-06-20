import React, { useState } from "react";
import { Button } from "primereact/button";
import { useForm, Controller } from "react-hook-form";
import LoginComponent from "../../components/LoginComponent";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
const Index = () => {
  const [checked, setChecked] = useState(false);
  const [currState, setCurrState] = useState("Login");
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm(); // Initialize useForm hook

  const onSubmit = (data) => {
    console.log(data); // Handle form submission
    if (currState === "Login") {
      console.log("call api login");
    }
    if (currState === "ForgotPassword") {
      console.log("call api forgotpassword");
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <Header />
      <div className="flex h-screen  ">
        <div className="w-1/2">
          <div className="w-auto h-full">
            <img
              src="https://primefaces.org/cdn/primereact/images/galleria/galleria7.jpg"
              alt=""
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="w-1/2 h-full flex items-center justify-center">
          <div className="w-1/2 h-min">
            {currState === "Login" && (
              <h1 className="text-left mb-4 font-bold text-black text-3xl">
                Đăng Nhập
              </h1>
            )}
            {currState === "ForgotPassword" && (
              <h1 className="text-left mb-4 font-bold text-black text-3xl">
                Quên mật khẩu
              </h1>
            )}
            {currState === "Register" && (
              <h1 className="text-left mb-4 font-bold text-black text-3xl">
                Đăng kí
              </h1>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="email" className="cursor-pointer">
                  <h4 className="text-xl text-black font-medium">
                    Email <span className="text-red-500">*</span>
                  </h4>
                </label>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Email không được để trống",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email không hợp lệ",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      id="email"
                      type="text"
                      className="w-full h-10 text-black-800 border border-solid border-gray-600 pb-2 pl-1 rounded-md"
                      placeholder="Nhập email"
                      {...field}
                    />
                  )}
                />
                <br />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </div>
              {currState === "Login" && (
                <div className="mb-4">
                  <label htmlFor="password" className="cursor-pointer">
                    <h4 className="text-xl text-black font-medium">
                      Mật Khẩu <span className="text-red-500">*</span>
                    </h4>
                  </label>
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Mật khẩu không được để trống",
                      pattern: {
                        value:
                          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
                        message:
                          "Mật khẩu cần ít nhất 8 ký tự, bao gồm chữ cái đầu viết hoa, số và ký tự đặc biệt",
                      },
                    }}
                    render={({ field }) => (
                      <input
                        id="password"
                        type="password"
                        className="w-full h-10 text-black-800 border border-solid border-gray-600 pb-2 pl-1 rounded-md"
                        placeholder="Nhập mật khẩu"
                        {...field}
                      />
                    )}
                  />
                  <br />
                  {errors.password && (
                    <span className="text-red-500 text-sm">
                      {errors.password.message}
                    </span>
                  )}
                </div>
              )}
              {currState === "Login" && (
                <div className="mb-4">
                  <input
                    type="checkbox"
                    onChange={(e) => setChecked(e.target.checked)}
                    checked={checked}
                  />
                  <span className="ml-2">Ghi nhớ mật khẩu</span>
                </div>
              )}

              {currState === "Login" ? (
                <div className="mb-4">
                  <Button
                    label="Đăng Nhập"
                    type="submit"
                    severity="info"
                    className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <Button
                    label="Gửi Mail"
                    type="submit"
                    severity="info"
                    className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                  />
                </div>
              )}
            </form>
            <div className="w-full flex justify-between">
              {currState === "Login" && (
                <span
                  onClick={() => setCurrState("ForgotPassword")}
                  className="text-blue-600 cursor-pointer"
                >
                  Quên mật khẩu
                </span>
              )}

              <span
                onClick={() => navigate("/checkmail")}
                className="text-blue-600 cursor-pointer"
              > 
                Tạo tài khoản
              </span>
            </div>
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">Hoặc đăng nhập với</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <LoginComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
