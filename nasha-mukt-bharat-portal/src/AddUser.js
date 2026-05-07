import { useState } from "react";
import "./Login.css";

export default function AddUser(){

  const [name,setName]=useState("");
  const [mobile,setMobile]=useState("");
  const [formAllowed,setFormAllowed]=useState("nashamuktbharat");

 const submit = async () => {

  const url = new URL(
    "https://script.google.com/macros/s/AKfycbwy-rBNIGlgADyHja9i0NWMe4EvZvIth-Jbm7Gld1M__OG1w5Ymg-Y8TgkmTzAnn4KaVw/exec"
  );

  url.searchParams.append("action", "addUser");
  url.searchParams.append("name", name);
  url.searchParams.append("mobile", mobile);
  url.searchParams.append("allowedForms", formAllowed);

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

        <select
          className="loginInput"
          value={formAllowed}
          onChange={e=>setFormAllowed(e.target.value)}
        >
          <option value="nashamuktbharat">
            Nasha Mukt Bharat Abhiyan
          </option>
        </select>

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