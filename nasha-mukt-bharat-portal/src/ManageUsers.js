import { useState } from "react";
import "./Login.css";

export default function ManageUsers() {

const [searchMobile,setSearchMobile] =
useState("");

const [user,setUser] =
useState(null);

const [name,setName] =
useState("");

const [mobile,setMobile] =
useState("");

const [formAllowed,setFormAllowed] =
useState([]);

const [showProjects,setShowProjects] =
useState(false);

const SHEET_ID =
"1K7UL9Q9QeeH68am1RvjL7C_BK5nhzoel3uC8pPJeE8w";

const searchUser = async () => {

try {

  const res = await fetch(
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=Sheet1`
  );

  const text = await res.text();

  const json = JSON.parse(
    text.substring(47).slice(0, -2)
  );

  const rows = json.table.rows;

  const found = rows.find(row => {

  const rowMobile =
    row.c?.[0]?.v
      ?.toString()
      .trim();

  return (
    rowMobile ===
    searchMobile.trim()
  );

});

  if(!found){

    alert("User not found");

    return;

  }

  const userData = {

  mobile:
    found.c?.[0]?.v
      ?.toString() || "",

  name:
    found.c?.[1]?.v || "",

  allowedForms:
    found.c?.[2]?.v || ""

};

  setUser(userData);
  setShowProjects(false);

  setName(userData.name);

  setMobile(userData.mobile);

  setFormAllowed(
    userData.allowedForms
      .split(",")
      .map(x=>x.trim())
  );

} catch(err){

  alert(err.message);

}


};

const updateUser = async () => {


const url = new URL(
  "https://script.google.com/macros/s/AKfycbzdi47WYeQPGMvYKAjw-zUQFjG0rIjThggOBx4TF6Nm8LOUg_ZmUKGv3qORx3Lg9k4pvw/exec"
);

url.searchParams.append(
  "action",
  "updateUser"
);

url.searchParams.append(
  "originalMobile",
  searchMobile
);

url.searchParams.append(
  "name",
  name
);

url.searchParams.append(
  "mobile",
  mobile
);

url.searchParams.append(
  "allowedForms",
  formAllowed.join(",")
);

const res =
  await fetch(url);

const text =
  await res.text();

if(text.includes("SUCCESS")){

  alert(
    "User updated successfully"
  );

}else{

  alert(
    "Failed to update user"
  );

}


};

const deleteUser = async () => {


const confirmDelete =
  window.confirm(
    "Are you sure you want to delete this user?"
  );

if(!confirmDelete)
  return;

const url = new URL(
  "https://script.google.com/macros/s/AKfycbzdi47WYeQPGMvYKAjw-zUQFjG0rIjThggOBx4TF6Nm8LOUg_ZmUKGv3qORx3Lg9k4pvw/exec"
);

url.searchParams.append(
  "action",
  "deleteUser"
);

url.searchParams.append(
  "mobile",
  searchMobile
);

const res =
  await fetch(url);

const text =
  await res.text();

if(text.includes("SUCCESS")){

  alert(
    "User deleted successfully"
  );

  setUser(null);

  setSearchMobile("");

  setName("");

  setMobile("");

  setFormAllowed([]);

}else{

  alert(
    "Failed to delete user"
  );

}


};

return (


<div className="loginPage">

  <div className="loginCard">

    <h1 className="loginTitle">
      Manage Users
    </h1>

    <input
      className="loginInput"
      placeholder="Search Mobile"
      value={searchMobile}
      onChange={e=>
        setSearchMobile(
          e.target.value
        )
      }
    />

    <button
      className="loginBtn"
      onClick={searchUser}
    >
      Search User
    </button>

    {user && (

      <>

        <input
          className="loginInput"
          placeholder="Name"
          value={name}
          onChange={e=>
            setName(
              e.target.value
            )
          }
        />

        <input
          className="loginInput"
          placeholder="Mobile"
          value={mobile}
          onChange={e=>
            setMobile(
              e.target.value
            )
          }
        />

        <div
          className="projectDropdown"
        >

          <div
            className="projectDropdownBtn"
            onClick={() =>
              setShowProjects(
                !showProjects
              )
            }
          >

            {formAllowed.length === 0
              ? "Select Projects"
              : `${formAllowed.length} Project(s) Selected`
            }

            ▼

          </div>

          {showProjects && (

            <div
              className="projectDropdownMenu"
            >

              <label>

                <input
                  type="checkbox"
                  checked={formAllowed.includes(
                    "nashamuktbharat"
                  )}
                  onChange={(e)=>{

                    if(e.target.checked){

                      setFormAllowed([
                        ...formAllowed,
                        "nashamuktbharat"
                      ]);

                    }else{

                      setFormAllowed(
                        formAllowed.filter(
                          x =>
                          x !==
                          "nashamuktbharat"
                        )
                      );

                    }

                  }}
                />

                Nasha Mukt Bharat Abhiyan

              </label>

              <label>

                <input
                  type="checkbox"
                  checked={formAllowed.includes(
                    "modelvillage"
                  )}
                  onChange={(e)=>{

                    if(e.target.checked){

                      setFormAllowed([
                        ...formAllowed,
                        "modelvillage"
                      ]);

                    }else{

                      setFormAllowed(
                        formAllowed.filter(
                          x =>
                          x !==
                          "modelvillage"
                        )
                      );

                    }

                  }}
                />

                Model Village Project

              </label>

            </div>

          )}

        </div>

        <button
          className="loginBtn"
          onClick={updateUser}
        >
          Update User
        </button>

        <button
          className="loginBtn"
          style={{
            background:"#d9534f"
          }}
          onClick={deleteUser}
        >
          Delete User
        </button>

      </>

    )}

  </div>

</div>


);

}
