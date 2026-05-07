import { useNavigate } from "react-router-dom";
import "./Landing.css";

export default function AdminPanel(){

  const navigate = useNavigate();

  const admin = localStorage.getItem("admin");

  if(!admin){

    navigate("/admin-login");

    return null;

  }

  return(

    <div className="landing">

      <img
        src="/ssu-logo.png"
        className="logo"
      />

      <h1>Admin Panel</h1>

      <p className="subtitle">
        Rural Activity Tracker
      </p>

      <div className="projects">

        {/* ADD USER */}
        <div
          className="projectCard"
          onClick={()=>navigate("/add-user")}
        >
          <img src="/add-user.png" />
          <p>Add User</p>
        </div>

        {/* View User */}
        <div
          className="projectCard"
          onClick={()=>
            window.open(
              "https://docs.google.com/spreadsheets/d/1K7UL9Q9QeeH68am1RvjL7C_BK5nhzoel3uC8pPJeE8w/edit?gid=0#gid=0",
              "_blank"
            )
          }
        >
          <img src="/sheet.png" />
          <p>View Users</p>
        </div>

        {/* DASHBOARD */}
        <div
          className="projectCard"
          onClick={()=>
            window.open(
              "https://lookerstudio.google.com/reporting/b07800ed-929f-48d5-8378-3eccc7fd1f38",
              "_blank"
            )
          }
        >
          <img src="/dashboard.png" />
          <p>View Dashboard</p>
        </div>

        {/* SUBMISSIONS */}
        <div
          className="projectCard"
          onClick={()=>
            window.open(
              "https://docs.google.com/spreadsheets/d/1DMljlhLSzr656-vQeUgBlRMeZLc3HejpHq0gWy7Mts8/edit?gid=0#gid=0",
              "_blank"
            )
          }
        >
          <img src="/sheet.png" />
          <p>Total Submissions</p>
        </div>

      </div>

    </div>

  );

}