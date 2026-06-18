import Navbar from "../components/Navbar";

const DashBoardLayoutPage = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default DashBoardLayoutPage;
