import React from "react";

interface MainTemplateProps {
  children: React.ReactNode;
}

const MainTemplate = ({ children }: MainTemplateProps) => {
  return <div>MainTemplate{children}</div>;
};

export default MainTemplate;
