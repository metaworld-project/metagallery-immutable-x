import { PropsWithChildren } from "react";
import Navbar from "./Navbar";

const MainLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default MainLayout;
