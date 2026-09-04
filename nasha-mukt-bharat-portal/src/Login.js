import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  const sendOtp = () => {
    if (mobile.length !== 10) {
      alert("Enter valid mobile");
      return;
    }
    alert("OTP is 123");
    setStep(2);
  };

  const login = async () => {
    if (otp !== "123") {
      alert("Wrong OTP");
      return;
    }

   const SHEET_ID = "1K7UL9Q9QeeH68am1RvjL7C_BK5nhzoel3uC8pPJeE8w";

const res = await fetch(
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=Users`
);

const text = await res.text();

const json = JSON.parse(
  text.substring(47).slice(0, -2)
);

const rows = json.table.rows;

const data = rows.map(r => ({
  mobile: r.c[0]?.v?.toString(),
  name: r.c[1]?.v,
  allowedForms: r.c[2]?.v
}));

    let user = data.find(u => u.mobile === mobile);

    if (!user) {
      alert("User not found");
      return;
    }

    // 🔥 IMPORTANT
    user.allowedForms = user.allowedForms.split(",");

    localStorage.setItem("user", JSON.stringify(user));

    navigate("/home");
  };

  return (

  <div className="loginPage">

    <div className="loginCard">

      {/* LOGO */}
      <img
        src="/ssu-logo.png"
        alt="SSU Logo"
        className="loginLogo"
      />

      {/* TITLE */}
      <h1 className="loginTitle">
        Social Outreach - Sri Sri University
      </h1>

      <p className="loginSubtitle">
        powered by Sri Sri University
      </p>

      {/* STEP 1 */}
      {step === 1 && (
        <>

          <input
            className="loginInput"
            placeholder="Enter Mobile Number"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
          />

          <button
            className="loginBtn"
            onClick={sendOtp}
          >
            Send OTP
          </button>
          <button
  className="loginBtn"
  style={{
    marginTop:"10px",
    background:"#444"
  }}
  onClick={()=>navigate("/admin-login")}
>
  Admin Login
</button>

        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>

          <p className="otpText">
            OTP sent to {mobile}
          </p>

          <input
            className="loginInput"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />

          <button
            className="loginBtn"
            onClick={login}
          >
            Login
          </button>

        </>
      )}

    </div>

  </div>

);
}