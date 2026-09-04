import { useState } from "react";
import "./Login.css";
export default function AddUser(){

  const [name,setName]=useState("");
  const [mobile,setMobile]=useState("");
  const [showProjects,setShowProjects] =
  useState(false);

const [formAllowed,setFormAllowed] =
  useState([]);

  const userExists = async (mobile) => {

  const SHEET_ID =
    "1K7UL9Q9QeeH68am1RvjL7C_BK5nhzoel3uC8pPJeE8w";

  try {

    const res = await fetch(
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=Sheet1`
    );

    const text = await res.text();

    const json = JSON.parse(
      text.substring(47).slice(0, -2)
    );

    const rows = json.table.rows;

    return rows.some(row => {

      const existingMobile =
        row.c?.[0]?.v?.toString().trim();

      return (
        existingMobile ===
        mobile.toString().trim()
      );

    });

  } catch (err) {

    console.error(err);

    return false;

  }

};

 const submit = async () => {

   if (!name || !mobile) {

    alert("Please fill all fields");

    return;

  }
  if(formAllowed.length === 0){

  alert(
    "Please select at least one project"
  );

  return;

}

  const exists = await userExists(mobile);

  if (exists) {

    alert(
      "User already exists. Please modify the existing user instead."
    );

    return;

  }

  const url = new URL(
    "https://script.google.com/macros/s/AKfycbwy-rBNIGlgADyHja9i0NWMe4EvZvIth-Jbm7Gld1M__OG1w5Ymg-Y8TgkmTzAnn4KaVw/exec"
  );

  url.searchParams.append("action", "addUser");
  url.searchParams.append("name", name);
  url.searchParams.append("mobile", mobile);
  url.searchParams.append(
  "allowedForms",
  formAllowed.join(",")
);

  try {

    const res = await fetch(url);

    const text = await res.text();

    if (text.includes("SUCCESS")) {

      alert("User Successfully Added");

      setName("");
      setMobile("");

    } else {

      alert("Something went wrong");

    }

  } catch(err) {

    alert(err.message);

  }

};
  return(

    <div className="loginPage">

      <div className="loginCard">

        <h1 className="loginTitle">
          Add User
        </h1>

        <input
          className="loginInput"
          placeholder="Name"
          value={name}
          onChange={e=>setName(e.target.value)}
        />

        <input
          className="loginInput"
          placeholder="Mobile"
          value={mobile}
          onChange={e=>setMobile(e.target.value)}
        />

<div className="projectDropdown">

  <div
    className="projectDropdownBtn"
    onClick={() =>
      setShowProjects(!showProjects)
    }
  >

    {formAllowed.length === 0
      ? "Select Projects"
      : `${formAllowed.length} Project(s) Selected`
    }

    ▼

  </div>

  {showProjects && (

    <div className="projectDropdownMenu">

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
                  x => x !==
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
                  x => x !==
                  "modelvillage"
                )
              );

            }

          }}
        />

        Model Village Project

      </label>

      <label>

        <input
          type="checkbox"
          checked={formAllowed.includes(
            "ssuactivities"
          )}
          onChange={(e)=>{

            if(e.target.checked){

              setFormAllowed([
                ...formAllowed,
                "ssuactivities"
              ]);

            }else{

              setFormAllowed(
                formAllowed.filter(
                  x => x !==
                  "ssuactivities"
                )
              );

            }

          }}
        />

        Sri Sri University Activities Module

      </label>

    </div>

  )}

</div>
       



        <button
          className="loginBtn"
          onClick={submit}
        >
          Add User
        </button>

      </div>

    </div>

  );

}