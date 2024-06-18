import React from "react";
import { Button } from "primereact/button";
import { useForm, Controller } from "react-hook-form";

const Index = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data); // Handle form submission
    // You can add further logic here to handle form submission, like sending a request to reset password
  };

  return (
    <div className="flex h-screen">
      <div className="w-full flex items-center justify-center">
        <div className="w-1/4 h-min border border-gray-500 rounded-md p-10">
          <h1 className="text-left mb-4 font-bold text-black text-3xl">
            Quên Mật Khẩu
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="email">
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
                    {...field}
                    type="text"
                    className="w-full h-10 text-black border border-gray-600 rounded-md"
                    placeholder="Nhập email"
                  />
                )}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="mb-4">
              <Button
                label="Gửi mail"
                type="submit"
                className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
