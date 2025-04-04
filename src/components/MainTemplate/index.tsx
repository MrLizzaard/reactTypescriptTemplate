import React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

interface MainTemplateProps {
  children: React.ReactNode;
}

const MainTemplate = ({ children }: MainTemplateProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        await axiosInstance.get("/auth/logout");
      }
    } catch (err) {
      console.error("Logout request failed", err);
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    navigate("/login");
  };
  return (
    <div>
      <div>MainTemplate</div>
      <button type="button" onClick={handleLogout}>
        로그아웃
      </button>
      {children}
    </div>
  );
};

export default MainTemplate;
