import "./TopbarStyle.css";
import { Link } from "react-router-dom";

const Topbar = () => {
  return (
    <div className="topbar-wrapper">
      <div className="nav-wrapper">
        <div className="nav-item">
          <Link to="/">HSPACE</Link>
        </div>
      </div>
      <div className="nav-wrapper">
        <div className="nav-item">
          <a
            href="https://github.com/ChambitTrace"
            target="_blank"
            rel="noopener noreferrer"
          >
            About
          </a>
        </div>
        <div className="nav-item">
          <Link to="/login">Login</Link>
        </div>
        <div className="nav-item">
          <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
