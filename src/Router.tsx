import React from "react";
import { Route, Routes } from "react-router-dom";
import Introduce from "./pages/Introduce";
import MainPage from "./pages/MainPage";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";

interface RouterItem {
  path: string;
  element: React.ReactNode;
  title: string;
}

const routerItems: RouterItem[] = [
  { path: "/", element: <Introduce />, title: "소개" },
  { path: "/projects", element: <Projects />, title: "프로젝트" },
];

const Router = () => {
  return (
    <Routes>
      <Route element={<MainPage />}>
        {routerItems.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
