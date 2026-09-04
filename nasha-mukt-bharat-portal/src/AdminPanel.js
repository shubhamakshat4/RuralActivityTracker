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
        Social Outreach - Sri Sri University
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

        <div
          className="projectCard"
          onClick={() => navigate("/manage-users")}
        >
          <img src="/manage_users.png" alt="Manage Users" />
          <p>Manage Users</p>
        </div>

        {/* GEOGRAPHICAL MAPPING OF ACTIVITIES */}
        <div
          className="projectCard"
          onClick={() => navigate("/geographical-mapping")}
          style={{ border: "2px solid #611827" }}
        >
          <div style={{ fontSize: "36px", marginBottom: "8px" }}>🗺️</div>
          <p style={{ fontWeight: "bold" }}>Geographical Mapping of Activities</p>
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
          <p>View Dashboard - Nasha Mukt Bharat Project</p>
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
          <p>Total Submissions - Nasha Mukt Bharat Project</p>
        </div>

        <div
          className="projectCard"
          onClick={()=>
            window.open(
              "https://datastudio.google.com/u/0/reporting/15c9b565-fc03-438a-845f-cc2a3d2bc6bf",
              "_blank"
            )
          }
        >
          <img src="/dashboard.png" />
          <p>View Dashboard - Model Village Project</p>
        </div>

        {/* SUBMISSIONS */}
        <div
          className="projectCard"
          onClick={()=>
            window.open(
              "https://docs.google.com/spreadsheets/d/1Ica9n20oQmcUHRaLDTbosQnfn3WQNZoqKt8D6hqR8Y0/",
              "_blank"
            )
          }
        >
          <img src="/sheet.png" alt="Model Village Sheet" />
          <p>Total Submissions - Model Village Project</p>
        </div>

        {/* SSU ACTIVITIES DASHBOARD */}
        <div
          className="projectCard"
          onClick={()=>
            window.open(
              "https://datastudio.google.com/u/0/reporting/19b34bbd-1d42-40c4-8716-449e96f7d832/page/page_12345",
              "_blank"
            )
          }
        >
          <img src="/dashboard.png" alt="SSU Activities Dashboard" />
          <p>View Dashboard - Sri Sri University Activities Project</p>
        </div>

        {/* SSU ACTIVITIES SUBMISSIONS */}
        <div
          className="projectCard"
          onClick={()=>
            window.open(
              "https://docs.google.com/spreadsheets/d/1RgY8hXTIg6-f0pRoCOSzT4uOyfPmfkA9REmLJEXHAAI/edit?gid=0#gid=0",
              "_blank"
            )
          }
        >
          <img src="/sheet.png" alt="SSU Activities Sheet" />
          <p>Total Submissions - Sri Sri University Activities Project</p>
        </div>

      </div>

    </div>

  );

}