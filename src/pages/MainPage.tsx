import { Outlet } from "react-router-dom";
import MainTemplate from "../components/MainTemplate";

const MainPage = () => {
  return (
    <MainTemplate>
      <Outlet />
    </MainTemplate>
  );
};

export default MainPage;
