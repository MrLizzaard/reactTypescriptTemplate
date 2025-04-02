import React from "react";
import { Link } from "react-router-dom";

const Introduce = () => {
  return (
    <div>
      소개
      <ul>
        <li style={{ marginBottom: "10px", border: "1px solid #ddd", padding: "10px" }}>
          <Link to="/projects">프로젝트</Link>
        </li>
        <li style={{ marginBottom: "10px", border: "1px solid #ddd", padding: "10px" }}>
          <Link to="/chat-bot">챗봇</Link>
        </li>
      </ul>
    </div>
  );
};

export default Introduce;
