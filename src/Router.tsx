import React from "react";
import { Route, Routes } from "react-router-dom";
import Introduce from "./pages/Introduce";
import MainPage from "./pages/MainPage";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import ChatBot from "./pages/ChatBot";
import Login from "./pages/Login";
import RequireAuth from "./components/RequireAuth";

interface RouterItem {
  path: string;
  element: React.ReactElement;
  title: string;
}

const routerItems: RouterItem[] = [
  { path: "/", element: <Introduce />, title: "소개" },
  { path: "/projects", element: <Projects />, title: "프로젝트" },
  { path: "/chat-bot", element: <ChatBot />, title: "챗봇" },
];

const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} /> {/* 로그인은 예외 */}
      <Route element={<MainPage />}>
        {routerItems.map((route) => (
          <Route key={route.path} path={route.path} element={<RequireAuth>{route.element}</RequireAuth>} />
        ))}
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
