import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Employees from "../pages/Employees";
import Departments from "../pages/Departments";
import Payroll from "../pages/Payroll";
import Leave from "../pages/Leave";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/departments" element={<Departments />} />
      <Route path="/payroll" element={<Payroll />} />
      <Route path="/leave" element={<Leave />} />
    </Routes>
  );
}

export default AppRoutes;