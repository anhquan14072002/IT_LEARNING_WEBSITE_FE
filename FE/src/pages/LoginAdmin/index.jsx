import React, { useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { loginWithRoleAdmin } from "../../services/authenService";
import { REJECT } from "../../utils";
import { Toast } from "primereact/toast";

export default function About() {
  const toast = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async () => {
    try {
      await loginWithRoleAdmin(email, password);
      navigate("/dashboard");
    } catch (error) {
      REJECT(toast,"Sai tài khoản hoặc mật khẩu ");
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium text-gray-900">Quản Lý</h1>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-gray-900 text-xl font-medium mb-2"
          >
            Tài Khoản <span className="text-red-500">*</span>
          </label>
          <InputText
            id="email"
            type="text"
            placeholder="Nhập tài khoản"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-gray-300 border-solid border rounded-md py-2 px-3"
          />
        </div>
        <br />

        <div>
          <label
            htmlFor="password"
            className="block text-gray-900 text-xl font-medium mb-2"
          >
            Mật Khẩu<span className="text-red-500">*</span>
          </label>
          <InputText
            id="password"
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-gray-300 border-solid border rounded-md py-2 px-3"
          />
        </div>
        <br />
        {/* Remove parentheses from handleSubmit */}
        <Button
          label="Đăng Nhập"
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        />
      </div>
      <Toast ref={toast} />
    </div>
  );
}
