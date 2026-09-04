import "./Landing.css";
import { useNavigate } from "react-router-dom";

export default function Landing() {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <div className="landing">

      <img src="/ssu-logo.png" className="logo" />

      <h1>Social Outreach - Sri Sri University</h1>
      <p className="subtitle">powered by Sri Sri University</p>

      <h3>Welcome {user.name} ji</h3>

      <div className="projects">

        {/* Nasha */}
        {user.allowedForms.includes("nashamuktbharat") && (
          <div className="projectCard" onClick={() => navigate("/app")}>
            <img src="/nasha.png" />
            <p>Nasha Mukt Bharat Abhiyan</p>
          </div>
        )}

        {/* Model Village */}
{user.allowedForms.includes("modelvillage") && (
  <div
    className="projectCard"
    onClick={() => navigate("/model-village")}
  >
    <img src="/model_village.png" alt="Model Village Project" />
    <p>Model Village Project</p>
  </div>
)}

        {/* SSU Activities */}
        {user.allowedForms.includes("ssuactivities") && (
          <div
            className="projectCard"
            onClick={() => navigate("/ssu-activities")}
          >
            <img src="/ssu-logo.png" alt="Sri Sri University Activities" />
            <p>Sri Sri University Activities</p>
          </div>
        )}

        {/* My submissions */}
        <div className="projectCard" onClick={() => navigate("/my-submissions")}>
          <img src="/history.jpg" />
          <p>My Submissions</p>
        </div>

      </div>
    </div>
  );
}