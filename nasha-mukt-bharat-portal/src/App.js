import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Landing from "./Landing";
import MainApp from "./MainApp";
import MySubmissions from "./MySubmissions";
import AdminLogin from "./AdminLogin";
import AdminPanel from "./AdminPanel";
import AddUser from "./AddUser";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Landing />} />
        <Route path="/app" element={<MainApp />} />
        <Route
  path="/my-submissions"
  element={<MySubmissions />}
/>
<Route
  path="/admin-login"
  element={<AdminLogin />}
/>

<Route
  path="/admin"
  element={<AdminPanel />}
/>

<Route
  path="/add-user"
  element={<AddUser />}
/>
      </Routes>
    </BrowserRouter>
  );
}