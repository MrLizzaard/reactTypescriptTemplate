import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axiosInstance from "../api/axiosInstance";
import OAuthButtons from "../components/OAuthButtons";

const Wrapper = styled.div`
  max-width: 400px;
  margin: 5rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.75rem;
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  font-size: 1rem;
  cursor: pointer;
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/auth/login", { email, password });

      const { accessToken, refreshToken } = res.data;

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      navigate(from, { replace: true });
    } catch (err) {
      alert("로그인 실패");
      console.error(err);
    }
  };

  const handleOAuthLogin = (provider: "google" | "github" | "naver") => {
    window.location.href = `${process.env.REACT_APP_API_BASE_URL}/auth/${provider}`;
  };

  return (
    <Wrapper>
      <Title>로그인</Title>
      <form onSubmit={handleLogin}>
        <Input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit">로그인</Button>
      </form>
      <OAuthButtons onClick={handleOAuthLogin} />
    </Wrapper>
  );
};

export default Login;
