// src/components/GlobalLoading.tsx
import React from "react";
import styled from "styled-components";
import { useLoadingStore } from "../store/useLoadingStore";

const Overlay = styled.div`
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 8px solid #ccc;
  border-top: 8px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const GlobalLoading = () => {
  const isLoading = useLoadingStore((state) => state.loadingCount > 0);

  if (!isLoading) return null;

  return (
    <Overlay>
      <Spinner />
    </Overlay>
  );
};

export default GlobalLoading;
