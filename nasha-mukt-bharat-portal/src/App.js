import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Landing from "./Landing";
import MainApp from "./MainApp";
import MySubmissions from "./MySubmissions";
import AdminLogin from "./AdminLogin";
import AdminPanel from "./AdminPanel";
import AddUser from "./AddUser";
import ModelVillageApp from "./ModelVillageApp";
import ManageUsers from "./ManageUsers";
import SSUActivitiesApp from "./SSUActivitiesApp";
import GeographicalMap from "./GeographicalMap";

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

<Route
  path="/manage-users"
  element={<ManageUsers />}
/>

<Route
 path="/model-village"
 element={<ModelVillageApp />}
/>

<Route
 path="/ssu-activities"
 element={<SSUActivitiesApp />}
/>

<Route
 path="/geographical-mapping"
 element={<GeographicalMap />}
/>
      </Routes>
    </BrowserRouter>
  );
}