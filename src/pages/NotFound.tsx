// src/pages/NotFound.tsx
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  text-align: center;
  padding: 4rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  margin-bottom: 2rem;
`;

const NotFound = () => {
  return (
    <Wrapper>
      <Title>404</Title>
      <Message>페이지를 찾을 수 없습니다.</Message>
      <Link to="/">메인으로 돌아가기</Link>
    </Wrapper>
  );
};

export default NotFound;
