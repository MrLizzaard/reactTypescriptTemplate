import React from "react";
import { GomokuBoard } from "../components/Gomoku/Board";

const TestPage = () => {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>🕹 오목 게임</h1>
      <GomokuBoard />
    </div>
  );
};

export default TestPage;
