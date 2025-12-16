import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Algorithm Visualizer</h1>
        <nav className="nav">
          <Link to="/" className="nav-button">
            Home
          </Link>
          <Link to="/bubble-sort" className="nav-button">
            Bubble Sort
          </Link>
          <Link to="/random-walk" className="nav-button">
            Random Walk
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
