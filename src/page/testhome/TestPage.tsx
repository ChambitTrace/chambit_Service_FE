import { useNavigate } from "react-router-dom";
import "./TestPageStyle.css"

const TestPage = () => {
  const navigate = useNavigate();

  return (
    <div className="test-page-container">
      <h1 className="test-page-title">Hello!</h1>
      <button className="move-btn" onClick={() => navigate("/dashboard")}>대시보드로 이동</button>
    </div>
  );
};

export default TestPage;
