
import "./Landing.css";
import { useNavigate } from "react-router-dom";

export default function Landing() {

  const navigate = useNavigate();   // ✅ ADD THIS

  return (
    <div className="landing">

      {/* LOGO */}
      <img
        src="/ssu-logo.png"
        alt="SSU Logo"
        className="logo"
      />

      {/* TITLE */}
      <h1>Rural Activity Tracker</h1>
      <p className="subtitle">
        powered by Sri Sri University
      </p>

      {/* PROJECT SECTION */}
      <div className="projects">

        {/* Nasha Mukt */}
        <div
          className="projectCard"
          onClick={() => navigate("/app")}   // ✅ FIXED
        >
          <img src="/nasha.png" alt="Nasha Mukt" />
          <p>Nasha Mukt Bharat Abhiyan</p>
        </div>

        {/* Future Placeholder */}
        <div className="projectCard disabled">
          <img src="/coming-soon.png" alt="Coming Soon" />
          <p>Coming Soon</p>
        </div>

      </div>

    </div>
  );
}