import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Algorithm Visualizer</h1>

      <div className="algorithms-grid">
        <Link to="/bubble-sort" className="algorithm-button">
          Bubble Sort
        </Link>

        <Link to="/random-walk" className="algorithm-button">
          Random Walk
        </Link>
      </div>
    </div>
  );
};

export default Home;
