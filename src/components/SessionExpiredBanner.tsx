// src/components/SessionExpiredBanner.tsx
import React, { useEffect } from "react";
import styled from "styled-components";
import { useSessionStore } from "../store/useSessionStore";

const Banner = styled.div`
  background: #ff4444;
  color: white;
  padding: 1rem;
  text-align: center;
`;

const SessionExpiredBanner = () => {
  const { sessionExpired, expireReason } = useSessionStore();

  useEffect(() => {
    if (sessionExpired) {
      const timeout = setTimeout(() => {
        window.location.href = "/login";
      }, 3000); // 3초 후 자동 리디렉션
      return () => clearTimeout(timeout);
    }
  }, [sessionExpired]);

  if (!sessionExpired) return null;

  return <Banner>{expireReason || "세션이 만료되었습니다. 로그인 페이지로 이동합니다."}</Banner>;
};

export default SessionExpiredBanner;
