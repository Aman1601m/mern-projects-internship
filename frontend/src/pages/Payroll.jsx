import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function Dashboard() {

  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalSalary: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {

      const res = await api.get("/employees/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setStats(res.data.data);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="d-flex">

      <Sidebar />

      <div className="container-fluid p-4">

        <h2>Dashboard</h2>

        <div className="row mt-4">

          <div className="col-md-4">
            <div className="card shadow p-3">
              <h5>Total Employees</h5>
              <h2>{stats.totalEmployees}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow p-3">
              <h5>Total Departments</h5>
              <h2>{stats.totalDepartments}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow p-3">
              <h5>Total Salary</h5>
              <h2>₹{stats.totalSalary}</h2>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;