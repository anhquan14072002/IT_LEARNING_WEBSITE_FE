import React, { useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { loginWithRoleAdmin, forgotPassword } from "../../services/authenService";
import { decodeToken, REJECT, CHECKMAIL } from "../../utils";
import { Toast } from "primereact/toast";
import { useDispatch } from "react-redux";
import { addUser } from "../../redux/userr/userSlice";
import { Controller, useForm } from "react-hook-form";


export default function About() {
  const toast = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const getNavigationPath = (role) => {
    switch (role) {
      case "Admin":
        return "/dashboard/statistic";
      case "ContentManager":
        return "/dashboard/lesson";
      default:
        return "/";
    }
  };

  const onSubmit = async (data) => {
    const { email, password } = data;
    try {
      // Handle login or forgot password based on `currState` logic
      const response = await loginWithRoleAdmin(email, password);
      if (response.data) {
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
        localStorage.setItem("userId", response.data.data.admin.id);
        localStorage.setItem("userEmail", response.data.data.admin.email);
        const decodedToken = decodeToken(response.data.data.accessToken);
        dispatch(addUser(decodedToken));
        navigate(getNavigationPath(decodedToken.role));
      } else {
        REJECT(toast, "Sai tài khoản hoặc mật khẩu");
      }
    } catch (error) {
          REJECT(toast, "Sai tài khoản hoặc mật khẩu");
    }
  };

 

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
      <div className="text-center mb-8">
          <h1 className="text-3xl font-medium text-gray-900">Quản Lý</h1>
        </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="email" className="cursor-pointer">
            <h4 className="text-xl text-black font-medium">
              Email <span className="text-red-500">*</span>
            </h4>
          </label>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email không được để trống",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email không hợp lệ",
              },
            }}
            render={({ field }) => (
              <InputText
                id="email"
                type="text"
                className="w-full h-10 text-black-800 border border-solid border-gray-600 pb-2 pl-1 rounded-md shadow-none"
                placeholder="Nhập email"
                {...field}
              />
            )}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

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
                            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/,
                          message:
                            "Mật khẩu cần ít nhất 6 ký tự, bao gồm chữ cái đầu viết hoa, số và ký tự đặc biệt",
                        },
                      }}
                      render={({ field }) => (
                        <InputText
                          id="password"
                          type="password"
                          className="w-full h-10 text-black-800 border border-solid border-gray-600 pb-2 pl-1 rounded-md shadow-none"
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
          <div className="mb-4">
            <Button
              label="Đăng Nhập"
              type="submit"
              severity="info"
              className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            />
          </div>
       
      </form>
      <Toast ref={toast} />
      </div>
    </div>
  );
}
